import { Module } from '@nestjs/common';
import { UserOrdersService } from './user-orders.service';
import { UserOrdersResolver } from './user-orders.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IikoModule } from 'src/iiko/iiko.module';
import { EpayModule } from 'src/epay/epay.module';

@Module({
  providers: [UserOrdersResolver, UserOrdersService],
  imports: [PrismaModule, IikoModule, EpayModule],
})
export class UserOrdersModule {}
