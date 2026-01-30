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
    // Clean phone number: "+7 (701) 981-49-99" -> "+77019814999"
    const cleanPhone = to.replace(/[\s\(\)\-]/g, '');
    
    console.log(`Sending SMS to ${cleanPhone}: ${text}`);
    
    return firstValueFrom(
      this.httpService.post(
        'http://isms.center/api/sms/send',
        {
          from: 'KiT_Notify',
          to: cleanPhone,
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