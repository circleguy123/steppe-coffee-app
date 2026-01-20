import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IikoModule } from 'src/iiko/iiko.module';
import { LoyaltyResolver } from './loyalty/loyalty.resolver';
import { LoyaltyService } from './loyalty/loyalty.service';

@Module({
  providers: [UsersResolver, UsersService, LoyaltyResolver, LoyaltyService],
  imports: [PrismaModule, IikoModule],
  exports: [UsersService],
})
export class UsersModule {}
