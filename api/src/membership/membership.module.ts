import { Module } from '@nestjs/common';
import { MembershipResolver } from './membership.resolver';
import { MembershipService } from './membership.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EpayModule } from 'src/epay/epay.module';
import { ScheduleModule } from '@nestjs/schedule';
import { IikoModule } from 'src/iiko/iiko.module';

@Module({
  providers: [MembershipResolver, MembershipService],
  imports: [PrismaModule, EpayModule, IikoModule, ScheduleModule.forRoot()],
})
export class MembershipModule {}
