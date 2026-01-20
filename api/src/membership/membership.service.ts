import { Injectable } from '@nestjs/common';
import { EpayService } from 'src/epay/epay.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Membership } from './entities/membership.entity';
import { EpayOrderStatus, EpayOrderType } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MembershipStatus } from './enums/membership-status.enum';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import iikoConfig from 'src/_config/iiko.config';
import { IikoService } from 'src/iiko/iiko.service';

@Injectable()
export class MembershipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly epayService: EpayService,
    private readonly httpService: HttpService,
    private readonly iikoService: IikoService,
  ) {}

  async create(
    userId: string,
    productId: string,
    cardId: string,
  ): Promise<Membership> {
    const total = await this.getMembershipTotal(productId);
    const membership = await this.prisma.membership.create({
      data: { userId, status: MembershipStatus.Idle, productId, total, cardId },
    });

    return this.processPayment(membership);
  }

  async findOne(userId: string): Promise<Membership | null> {
    return this.prisma.membership.findFirst({
      where: {
        userId,
        status: { in: [MembershipStatus.Active, MembershipStatus.Canceled] },
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancelMembership(userId: string, membershipId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      select: { iikoId: true },
    });
    await this.iikoService.removeCustomerFromCategory(user.iikoId);

    return this.prisma.membership.update({
      where: { id: membershipId, userId, status: MembershipStatus.Active },
      data: { status: MembershipStatus.Canceled },
    });
  }

  private async processPayment(membership: Membership) {
    const user = await this.prisma.user.findFirst({
      where: { id: membership.userId },
      select: { iikoId: true },
    });

    if (!user?.iikoId) {
      await this.failMembership(membership.id);
      throw new Error('User not found or iikoId is missing');
    }

    const invoice = await this.epayService.createEpayInvoice(
      membership.userId,
      EpayOrderType.Membership,
      null,
      membership.id,
    );

    const card = await this.prisma.epayUserCard.findFirst({
      where: { accountId: membership.userId, id: membership.cardId },
    });

    if (!card) {
      await this.epayService.failInvoice(membership.userId, invoice.id);
      return this.failMembership(membership.id);
    }

    try {
      const payment = await this.epayService.cardPayment(membership.userId, {
        amount: membership.total,
        currency: 'KZT',
        cardId: card.cardId,
        invoiceId: invoice.id,
      });

      if (payment.status !== EpayOrderStatus.paid)
        throw new Error('Payment failed');

      try {
        await this.iikoService.addCustomerToCategory(user.iikoId);
      } catch (error) {
        this.sendTelegramMessage(
          `❗️ Failed to add customer to category: ${user.iikoId}`,
        );
      }

      return this.prisma.membership.update({
        where: { id: membership.id },
        data: {
          status: MembershipStatus.Active,
          activatedAt: new Date(),
          expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      });
    } catch (err) {
      await this.epayService.failInvoice(membership.userId, invoice.id);
      return this.failMembership(membership.id);
    }
  }

  private async failMembership(membershipId: string) {
    return this.prisma.membership.update({
      where: { id: membershipId },
      data: { status: MembershipStatus.Failed },
    });
  }

  private async getMembershipTotal(productId: string): Promise<number> {
    const menu = await this.iikoService.getMenuById(
      iikoConfig.MEMBERSHIP_MENU_ID,
    );
    return menu.itemCategories
      .flatMap((cat) => cat.items)
      .find((item) => item.itemId === productId)
      .itemSizes.flatMap((size) => size.prices)
      .find((price) => price.organizationId === iikoConfig.ORGANIZATION_ID)
      .price;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async markExpiringMemberships() {
    const result = await this.prisma.membership.updateMany({
      where: {
        status: MembershipStatus.Active,
        expiresAt: { lte: new Date() },
      },
      data: { status: MembershipStatus.Expired },
    });

    await this.sendTelegramMessage(
      `⏳ markExpiringMemberships: ${result.count} expired.`,
    );
  }

  @Cron(CronExpression.EVERY_HOUR)
  async chargeExpiredMemberships() {
    const expiredMemberships = await this.getEligibleExpiredMemberships();

    if (!expiredMemberships.length) {
      await this.sendTelegramMessage(
        '📭 No expired memberships to renew this hour.',
      );
      return;
    }

    await this.sendTelegramMessage(
      `🧾 Found ${expiredMemberships.length} expired memberships to renew.`,
    );

    let processed = 0;
    let success = 0;
    let failed = 0;

    for (const membership of expiredMemberships) {
      const retries = await this.getRetryAttemptsCount(membership);

      if (retries >= 3) {
        await this.markAsRetryLimitReached(membership);
        continue;
      }

      try {
        const newMembership = await this.create(
          membership.userId,
          membership.productId,
          membership.cardId,
        );
        processed++;

        if (newMembership.status === MembershipStatus.Active) {
          await this.markAsProlonged(membership);
          success++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`Error renewing membership ${membership.id}:`, error);
        failed++;
        processed++;

        const user = await this.prisma.user.findFirst({
          where: { id: membership.userId },
          select: { iikoId: true },
        });

        await this.iikoService.removeCustomerFromCategory(user?.iikoId);
      }
    }

    await this.sendTelegramMessage(
      `🔔 Membership Renewals 🔔\nProcessed: ${processed}\n✅ Success: ${success}\n❌ Failed: ${failed}`,
    );
  }

  private async getEligibleExpiredMemberships() {
    const activeUsers = await this.prisma.membership.findMany({
      where: {
        expiresAt: { gte: new Date() },
        status: { in: [MembershipStatus.Active, MembershipStatus.Prolonged] },
      },
      select: { userId: true },
    });

    const excludeUserIds = activeUsers.map((u) => u.userId);

    return this.prisma.membership.findMany({
      where: {
        status: MembershipStatus.Expired,
        expiresAt: { lt: new Date() },
        NOT: { userId: { in: excludeUserIds } },
      },
    });
  }

  private async getRetryAttemptsCount(membership: Membership) {
    return this.prisma.membership.count({
      where: {
        userId: membership.userId,
        productId: membership.productId,
        status: MembershipStatus.Failed,
        createdAt: { gte: membership.createdAt },
      },
    });
  }

  private async markAsRetryLimitReached(membership: Membership) {
    return this.prisma.membership.update({
      where: { id: membership.id },
      data: { status: MembershipStatus.RetryLimitReached },
    });
  }

  private async markAsProlonged(original: Membership) {
    return this.prisma.membership.update({
      where: { id: original.id },
      data: { status: MembershipStatus.Prolonged },
    });
  }

  async sendTelegramMessage(message: string) {
    try {
      await firstValueFrom(
        this.httpService.post(process.env.TELEGRAM_URL, {
          chat_id: Number(process.env.TELEGRAM_CHAT_ID),
          text: message,
        }),
      );
    } catch (error) {
      console.error('Telegram API Error:', error);
    }
  }
}
