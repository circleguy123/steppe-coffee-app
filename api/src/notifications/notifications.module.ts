import { Module } from '@nestjs/common';
import { KitService } from './kit/kit.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [KitService],
  exports: [KitService],
})
export class NotificationsModule {}
