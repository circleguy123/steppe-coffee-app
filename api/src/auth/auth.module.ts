import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UniquePhoneValidator } from './validators/unique-phone.validator';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { IikoModule } from 'src/iiko/iiko.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, NotificationsModule, IikoModule, UsersModule],
  providers: [UniquePhoneValidator, AuthResolver, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
