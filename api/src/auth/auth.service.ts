import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { GraphQLError } from 'graphql';
import { UserSessionOutput } from './dto/user-session.output';
import { User } from 'src/users/entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { JwtPayload } from './interfaces/jwt.payload';
import { subSeconds } from 'date-fns';
import { KitService } from 'src/notifications/kit/kit.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly kitService: KitService,
    private readonly usersService: UsersService,
  ) {}

  async signup({ phone, name, birthday }: CreateUserInput) {
    let loginCode = this.generateLoginCode();
    let hashedLoginCode = await this.hashLoginCode(loginCode);

    if (phone === '+7 (777) 777-77-77') {
      loginCode = '7777';
      hashedLoginCode = await this.hashLoginCode(loginCode);
    } else {
      await this.sendLoginCode(phone, loginCode);
    }

    let user = await this.prisma.user.findFirst({
      where: { phone },
      select: { id: true, phone: true, name: true, deletedAt: true },
    });

    if (user && user.deletedAt) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { deletedAt: null, loginCode: hashedLoginCode },
        select: { id: true, phone: true, name: true, deletedAt: true },
      });
    }

    const birthDate = birthday
      ? this.usersService.parseDateFromString(birthday)
      : null;

    if (!user) {
      user = await this.prisma.user.create({
        data: { loginCode: hashedLoginCode, name, phone, birthDate },
        select: { id: true, phone: true, name: true, deletedAt: true },
      });
    }

    return new User(user);
  }

  async requestCode(phone: string) {
    const isTestPhone = phone === '+7 (777) 777-77-77';
    const loginCode = isTestPhone ? '7777' : this.generateLoginCode();
    const hashedLoginCode = await this.hashLoginCode(loginCode);

    try {
      const user = await this.prisma.user.update({
        data: {
          loginCode: hashedLoginCode,
          loginCodeIssuedAt: new Date(),
        },
        where: {
          phone,
          loginCodeIssuedAt: {
            lt: subSeconds(new Date(), 60),
          },
          deletedAt: null,
        },
      });

      if (user && !isTestPhone) {
        const smsResponse = await this.sendLoginCode(user.phone, loginCode);
        console.log('smsResponse', smsResponse);
      }

      return true;
    } catch (error) {
      console.log('request code error', error);
      return false;
    }
  }

  async login(phone: string, loginCode: string) {
    const user = await this.prisma.user.findFirst({ where: { phone } });
    if (!user || user.deletedAt) {
      throw new GraphQLError('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(loginCode, user.loginCode);
    if (!isPasswordValid) {
      throw new GraphQLError('Пользователь не найден');
    }

    if (!user.iikoId) {
      const iikoId = await this.usersService.createIikoCustomer(user);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { iikoId },
      });
    }

    const payload: JwtPayload = {
      sub: user.id,
      id: user.id,
      phone: user.phone,
      name: user.name,
      surName: user.surName,
    };
    const session = new UserSessionOutput(
      await this.jwtService.signAsync(payload),
    );

    return session;
  }

  async profile(request: { user: JwtPayload }) {
    const user = await this.prisma.user.findFirst({
      where: { id: request.user.id },
    });
    return new User(user);
  }

  async deleteAccount(userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });

    return !!user;
  }

  async registerDevice(deviceId: string) {
    const device = await this.prisma.device.findUnique({
      where: {
        id: deviceId,
      },
    });

    if (!device) {
      return await this.prisma.device.create({
        data: {
          id: deviceId,
        },
      });
    }
  }

  private generateLoginCode() {
    return `${Math.floor(Math.random() * 9000 + 1000)}`;
  }

  private async hashLoginCode(loginCode: string) {
    return await bcrypt.hash(`${loginCode}`, 10);
  }

  private async sendLoginCode(phone: string, loginCode: string) {
    console.log(`login code for ${phone} is ${loginCode}`);

    return this.kitService.sendSms(
      phone,
      `Your STEPPE COFFEE login code is ${loginCode}`,
    );
  }
}
