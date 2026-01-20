import {
  Controller,
  Get,
  Render,
  UseGuards,
  Request,
  Body,
  Post,
  Query,
} from '@nestjs/common';
import { EpayService } from './epay.service';
import { RestAuthGuard } from 'src/auth/rest-auth.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt.payload';

@Controller('pay')
export class EpayController {
  constructor(private readonly epayService: EpayService) {}

  @Get('save-card')
  @Render('epay')
  @UseGuards(RestAuthGuard)
  async saveCard(
    @Request() req: { user: JwtPayload },
    @Query('invoiceId') invoiceId: string,
  ) {
    console.log('[SAVE CARD] Incoming request', {
      userId: req.user.id,
      invoiceId,
    });
    const result = await this.epayService.saveCard(req.user, invoiceId);
    console.log('[SAVE CARD] Rendering template with data:', result);
    return result;
  }

  @Post('save-card/success')
  async saveCardSuccess(@Body() body) {
    return this.epayService.saveCardSuccess(body);
  }

  @Get('save-card/completed')
  async saveCardCompleted(@Query('invoiceId') invoiceId: string) {
    return { invoiceId };
  }

  @Post('error')
  async error(@Body() errorBody) {
    return this.epayService.recordError(errorBody);
  }
}
