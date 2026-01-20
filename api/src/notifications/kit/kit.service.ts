import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

/**
 * KazInfoTech service
 */
@Injectable()
export class KitService {
  constructor(private readonly httpService: HttpService) {}

  sendSms(to: string, text: string) {
    return firstValueFrom(
      this.httpService.post(
        'http://isms.center/api/sms/send',
        {
          from: 'KiT_Notify',
          to,
          text,
        },
        {
          headers: {
            Authorization: `Basic c3RlcHBlY29mZmVlOjZramZxalJWaw==`,
          },
        },
      ),
    );
  }
}
