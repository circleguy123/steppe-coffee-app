import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { IikoService } from 'src/iiko/iiko.service';
import { User } from './entities/user.entity';
import iikoConfig, { ORGANIZATION_ID } from 'src/_config/iiko.config';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly iikoService: IikoService,
  ) {}

  async update(userId: string, updateUserInput: UpdateUserInput) {
    const birthDate = this.parseDateFromString(updateUserInput.birthDate);
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateUserInput.name,
        surName: updateUserInput.surName,
        birthDate,
      },
    });

    this.iikoService.createCustomer({
      organizationId: iikoConfig.ORGANIZATION_ID,
      id: user.iikoId,
      birthday: user.birthDate ? this.formatDate(birthDate) : undefined,
      name: user.name,
      surName: user.surName,
    });

    return user;
  }

  async getUserCards(userId: string) {
    return this.prisma.epayUserCard.findMany({
      where: { accountId: userId },
    });
  }

  async removeCard(userId: string, cardId: string) {
    await this.prisma.epayUserCard.delete({
      where: {
        accountId: userId,
        id: cardId,
      },
    });

    return this.getUserCards(userId);
  }

  async getLoyalty(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    if (!user.iikoId) {
      this.createIikoCustomer(new User(user));
    }

    return await this.iikoService.getCustomerById(user.iikoId);
  }

  async createIikoCustomer(user: { id: string; name: string; phone: string }) {
    return await this.iikoService.createCustomer({
      cardNumber: user.id,
      name: user.name,
      organizationId: ORGANIZATION_ID,
      phone: user.phone,
      sex: 0,
      consentStatus: 1,
      shouldReceivePromoActionsInfo: false,
      userData: '',
    });
  }

  parseDateFromString(dateString: string): Date {
    const [day, month, year] = dateString.split('.').map(Number);

    if (!day || !month || !year) {
      throw new BadRequestException('Invalid date format. Expected dd.mm.yyyy');
    }

    const parsedDate = new Date(year, month - 1, day);

    // Validate the parsed date
    if (
      parsedDate.getFullYear() !== year ||
      parsedDate.getMonth() !== month - 1 ||
      parsedDate.getDate() !== day
    ) {
      throw new BadRequestException('Invalid date values.');
    }

    return parsedDate;
  }

  formatDate(date: Date): string {
    const pad = (num: number, size = 2) => num.toString().padStart(size, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are 0-indexed
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = pad(date.getMilliseconds(), 3); // Pad to 3 digits

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
}
