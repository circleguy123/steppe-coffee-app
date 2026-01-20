import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { formatPhone } from 'src/helpers/formatPhone';
import { JwtPayload } from 'src/auth/interfaces/jwt.payload';
import { EpayOrderStatus, EpayOrderType } from '@prisma/client';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export type EpayCurrencyType = 'KZT' | 'USD';

@Injectable()
export class EpayService {
  private clientId = process.env.EPAY_CLIENT_ID;
  private clientSecret = process.env.EPAY_CLIENT_SECRET;
  private terminal = process.env.EPAY_TERMINAL_ID;
  private tokenUrl = process.env.EPAY_TOKEN_URL;
  private paymentUrl = process.env.EPAY_PAYMENT_URL;

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createEpayInvoice(
    userId: string,
    type: EpayOrderType,
    userOrderId?: string,
    membershipId?: string,
  ) {
    const existingInvoice = await this.prisma.epayOrderInvoice.findFirst({
      where: { userId, type, status: 'new', userOrderId, membershipId },
    });

    if (existingInvoice) {
      return {
        ...existingInvoice,
        id: this.formatInvoiceId(existingInvoice.id),
      };
    }

    const epayInvoice = await this.prisma.epayOrderInvoice.create({
      data: { type, userId, userOrderId, membershipId, status: 'new' },
    });

    return {
      ...epayInvoice,
      id: this.formatInvoiceId(epayInvoice.id),
    };
  }

  async getUserInvoices(
    userId: string,
    type: EpayOrderType = EpayOrderType.SaveCard,
  ) {
    return this.prisma.epayOrderInvoice.findMany({
      where: {
        userId,
        type,
        status: { in: [EpayOrderStatus.new, EpayOrderStatus.pending] },
      },
    });
  }

  getInvoiceById(userId: string, invoiceId: number) {
    return this.prisma.epayOrderInvoice.findFirst({
      where: { userId, id: invoiceId },
    });
  }

  cancelInvoice(userId: string, invoiceId: number) {
    return this.prisma.epayOrderInvoice.update({
      where: { userId, id: invoiceId },
      data: { status: EpayOrderStatus.canceled },
    });
  }

  failInvoice(userId: string, invoiceId: string) {
    return this.prisma.epayOrderInvoice.update({
      where: { userId, id: this.extractInvoiceId(invoiceId) },
      data: { status: EpayOrderStatus.failed },
    });
  }

  async saveCard(user: JwtPayload, invoiceId: string) {
    console.log('[EPAY SERVICE] Generating token for invoice:', invoiceId);
    const token = await this.generateToken(invoiceId, 0, 'USD');

    const data = {
      description: 'Steppe Coffee Membership',
      token: JSON.stringify(token),
      terminal: this.terminal,
      cardSave: true,
      user: user,
      amount: 0,
      currency: 'USD',
      phone: formatPhone(user.phone).replace('+', ''),
      invoiceID: invoiceId,
      paymentType: 'cardVerification',
    };
    console.log('[EPAY SERVICE] Returning payment data:', data);
    return data;
  }

  async saveCardSuccess(data: any) {
    if (data.code === 'error' || data.code !== 'ok') {
      return this.recordError(data);
    }

    if (!data.cardId || !data.reference) {
      throw new Error('Missing required fields in the ePay response');
    }

    const invoiceId = this.extractInvoiceId(data.invoiceId);

    const savedCard = await this.prisma.epayUserCard.upsert({
      where: {
        accountId_cardId: { accountId: data.accountId, cardId: data.cardId },
      },
      update: {
        invoiceId,
        amount: data.amount,
        approvalCode: data.approvalCode,
        currency: data.currency,
        dateTime: new Date(data.dateTime),
        language: data.language,
        reason: data.reason,
        reasonCode: data.reasonCode,
        terminal: data.terminal,
        reference: data.reference,
        secure: data.secure,
        secureDetails: data.secureDetails,
        allData: data,
      },
      create: {
        accountId: data.accountId,
        amount: data.amount,
        approvalCode: data.approvalCode,
        cardId: data.cardId,
        cardMask: data.cardMask,
        cardType: data.cardType,
        currency: data.currency,
        dateTime: new Date(data.dateTime),
        description: data.description,
        invoiceId,
        ip: data.ip,
        ipCity: data.ipCity,
        ipCountry: data.ipCountry,
        ipDistrict: data.ipDistrict,
        ipLatitude: data.ipLatitude,
        ipLongitude: data.ipLongitude,
        ipRegion: data.ipRegion,
        issuer: data.issuer,
        language: data.language,
        name: data.name,
        phone: data.phone,
        reason: data.reason,
        reasonCode: data.reasonCode,
        reference: data.reference,
        secure: data.secure,
        secureDetails: data.secureDetails,
        terminal: data.terminal,
        allData: data,
      },
    });

    await this.prisma.epayOrderInvoice.update({
      where: { id: invoiceId, status: 'new' },
      data: { status: 'paid', paidAt: new Date() },
    });

    return { success: true, cardId: savedCard.cardId };
  }

  async recordError(errorData: any) {
    const invoiceId = errorData?.invoiceId
      ? this.extractInvoiceId(errorData.invoiceId)
      : null;

    if (invoiceId) {
      await this.prisma.epayOrderInvoice.update({
        where: { id: invoiceId, status: 'new' },
        data: { status: 'failed' },
      });
    }

    await this.prisma.epayOrderError.create({
      data: { errorData: JSON.stringify(errorData) },
    });

    return { success: false, message: errorData.message, code: errorData.code };
  }

  async cardPayment(
    userId: string,
    {
      amount,
      currency,
      invoiceId,
      cardId,
    }: {
      amount: number;
      currency: EpayCurrencyType;
      invoiceId: string;
      cardId: string;
    },
  ) {
    const userCard = await this.prisma.epayUserCard.findFirst({
      where: { accountId: userId, cardId },
    });

    if (!userCard) throw new Error('Сохраненная карта не найдена');

    const token = await this.generateToken(invoiceId, amount, currency);

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.access_token}`,
    };

    const paymentData = {
      amount,
      currency,
      name: userCard.name,
      terminalId: this.terminal,
      invoiceId: `${invoiceId}`,
      description: 'Steppe Coffee Membership',
      accountId: userId,
      phone: userCard.phone,
      backLink: `https://api.steppecoffee.kz/pay/invoice/${invoiceId}`,
      failureBackLink: 'https://example.kz/failure.html',
      postLink: 'https://api.steppecoffee.kz/pay/card-payment/success',
      failurePostLink: 'https://api.steppecoffee.kz/pay/error',
      language: 'rus',
      paymentType: 'cardId',
      cardId: { id: userCard.cardId },
    };

    const id = this.extractInvoiceId(invoiceId);

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.paymentUrl, paymentData, { headers }),
      );

      if (response.status !== 200) {
        throw new Error(`Ошибка платежа: ${response.data.message}`);
      }

      await this.prisma.epayOrderInvoice.update({
        where: { id, status: 'new' },
        data: { status: 'paid', paidAt: new Date() },
      });

      return this.getInvoiceById(userId, id);
    } catch (error) {
      const errorData = error.response?.data ?? {
        code: -1,
        message: 'error message',
      };
      await this.recordError(errorData);
      return this.getInvoiceById(userId, id);
    }
  }

  private formatInvoiceId(id: number): string {
    return id.toString().padStart(6, '0');
  }

  private extractInvoiceId(formattedId: string): number {
    return parseInt(formattedId, 10);
  }

  private async generateToken(
    invoiceID: string,
    amount: number,
    currency: EpayCurrencyType = 'KZT',
  ) {
    const cacheKey = `epay-token-${invoiceID}-${amount}-${currency}`;
    const cachedToken = await this.cacheManager.get<
      TokenResponse & { expires_at: number }
    >(cacheKey);

    const now = Date.now();

    if (cachedToken && cachedToken.expires_at > now) {
      return cachedToken;
    }

    try {
      const data = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scope:
          'webapi usermanagement email_send verification statement statistics payment',
        invoiceID: `${invoiceID}`,
        secret_hash: 'SecretHashForSteppeCoffeeFranchise',
        amount: `${amount}`,
        currency,
        terminal: this.terminal,
        postLink: '',
        failurePostLink: '',
      });

      console.log('TOKEN URL SEARCH PARAMS:', data);

      const response = await firstValueFrom(
        this.httpService.post<TokenResponse>(this.tokenUrl, data.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      ).catch((error) => {
        console.error('Error generating token:', error);
        throw new Error('Failed to generate token');
      });

      if (!response.data.access_token) {
        throw new Error('Invalid ePay response: no token');
      }

      const expiresInSeconds = 1200;
      const expiresAt = now + expiresInSeconds * 1000;
      const tokenData = { ...response.data, expires_at: expiresAt };
      await this.cacheManager.set(cacheKey, tokenData, expiresInSeconds * 1000);

      return response.data;
    } catch (error) {
      console.error('Error generating token:', error);
      throw new Error('Failed to generate token');
    }
  }
}
