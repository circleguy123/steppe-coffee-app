import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { IikoService } from 'src/iiko/iiko.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

@Injectable()
export class LoyaltyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly iikoService: IikoService,
    private readonly usersService: UsersService,
  ) {}

  async getLoyalty(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    if (!user.iikoId) {
      this.usersService.createIikoCustomer(new User(user));
    }

    return await this.iikoService.getCustomerById(user.iikoId);
  }
}
