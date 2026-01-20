import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EpayService } from './epay.service';
import { EpayController } from './epay.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EpayResolver } from './epay.resolver';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    PrismaModule,
  ],
  providers: [EpayService, EpayResolver],
  controllers: [EpayController],
  exports: [EpayService, HttpModule],
})
export class EpayModule {}
