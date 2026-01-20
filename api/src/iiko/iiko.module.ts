import { Module } from '@nestjs/common';
import { IikoService } from './iiko.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [IikoService],
  exports: [IikoService],
})
export class IikoModule {}
