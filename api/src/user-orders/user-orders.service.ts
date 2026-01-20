import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserOrderInput } from './dto/create-user-order.input';
import iikoConfig from 'src/_config/iiko.config';
import { PaymentStatus } from './enums/payment-status.enum';
import { UserOrderOutput } from './dto/user-order.output';
import { IikoStatus } from './enums/iiko-status.enum';
import { IikoService } from 'src/iiko/iiko.service';
import { JwtPayload } from 'src/auth/interfaces/jwt.payload';
import { CreateUserOrderItemInput } from './dto/create-user-order-item.input';
import {
  EpayOrderStatus,
  EpayOrderType,
  Prisma,
  UserOrderType,
} from '@prisma/client';
import { formatPhone } from 'src/helpers/formatPhone';
import { EpayService } from 'src/epay/epay.service';
import { RetryUserOrderPaymentInput } from './dto/retry-user-order-payment.input';

type UserOrderWithItems = Prisma.UserOrderGetPayload<{
  include: { userOrderItem: true };
}>;

@Injectable()
export class UserOrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly iikoService: IikoService,
    private readonly epayService: EpayService,
  ) {}

  // Create a new UserOrder
  async create(
    user: JwtPayload,
    { userOrderItem, cardId, terminalId, ...input }: CreateUserOrderInput,
  ): Promise<UserOrderOutput> {
    const userOrderItems = await this.getOrderItems(userOrderItem);
    const total = this.calculateTotal(userOrderItems);

    const terminalGroupId = await this.getTerminalGroupId(
      iikoConfig.ORGANIZATION_ID,
      terminalId,
    );

    const userOrder = await this.prisma.userOrder.create({
      data: {
        ...input,
        iikoStatus: IikoStatus.notCreated,
        menuId: iikoConfig.EXTERNAL_MENU_ID,
        organizationId: iikoConfig.ORGANIZATION_ID,
        paymentStatus: PaymentStatus.new,
        terminalGroupId,
        total,
        userOrderItem: { createMany: { data: userOrderItems } },
        user: { connect: { id: user.id } },
      },
      include: { userOrderItem: true, user: true },
    });

    return this.processPayment(user, userOrder, cardId);
  }

  async retryUserOrderPayment(
    user: JwtPayload,
    { userOrderId, cardId }: RetryUserOrderPaymentInput,
  ): Promise<UserOrderOutput> {
    const userOrder = await this.prisma.userOrder.findFirstOrThrow({
      where: {
        id: userOrderId,
        userId: user.id,
        paymentStatus: PaymentStatus.failed,
      },
      include: { userOrderItem: true },
    });

    return this.processPayment(user, userOrder, cardId);
  }

  async createRewardOrder(
    user: JwtPayload,
    { userOrderItem, terminalId, ...input }: CreateUserOrderInput,
  ) {
    const userOrderItems = await this.getOrderItems(
      userOrderItem,
      iikoConfig.REWARD_MENU_ID,
    );
    const total = this.calculateTotal(userOrderItems);

    const terminalGroupId = await this.getTerminalGroupId(
      iikoConfig.ORGANIZATION_ID,
      terminalId,
    );

    const userOrder = await this.prisma.userOrder.create({
      data: {
        ...input,
        iikoStatus: IikoStatus.notCreated,
        menuId: iikoConfig.REWARD_MENU_ID,
        organizationId: iikoConfig.ORGANIZATION_ID,
        paymentStatus: PaymentStatus.new,
        terminalGroupId,
        type: UserOrderType.Reward,
        total,
        userOrderItem: { createMany: { data: userOrderItems } },
        user: { connect: { id: user.id } },
      },
      include: { userOrderItem: true, user: true },
    });

    return this.createIikoOrder(user, userOrder);
  }

  // Get all UserOrders for a specific user
  async findAll(userId: string): Promise<UserOrderOutput[]> {
    return this.prisma.userOrder.findMany({
      where: { userId },
      include: { user: true, userOrderItem: true },
      orderBy: [
        {
          createdAt: 'desc',
        },
        { orderNumber: 'desc' },
      ],
    });
  }

  // Get a specific UserOrder by ID for a specific user
  async findOne(id: string, userId: string): Promise<UserOrderOutput> {
    const userOrder = await this.prisma.userOrder.findFirst({
      where: { id, userId },
      include: { user: true, userOrderItem: true },
    });

    if (!userOrder) {
      throw new NotFoundException('Order not found.');
    }

    if (userOrder.userId !== userId) {
      throw new UnauthorizedException('You do not have access to this order.');
    }

    return userOrder;
  }

  private async getOrderItems(
    userOrderItem: CreateUserOrderItemInput[],
    menuId = iikoConfig.EXTERNAL_MENU_ID,
  ) {
    const iikoMenu = await this.iikoService.getMenuById(menuId);

    return iikoMenu.itemCategories.flatMap((category) =>
      category.items
        .filter(({ itemId }) =>
          userOrderItem.some((userItem) => userItem.productId === itemId),
        )
        .flatMap((item) =>
          item.itemSizes
            .filter(({ sizeId }) =>
              userOrderItem.some(
                (userItem) => userItem.productSizeId === sizeId,
              ),
            )
            .flatMap((itemSize) =>
              itemSize.prices
                .filter(
                  (itemPrice) =>
                    itemPrice.organizationId === iikoConfig.ORGANIZATION_ID,
                )
                .map((itemPrice) => {
                  const orderItem = userOrderItem.find(
                    (userItem) => userItem.productId === item.itemId,
                  );

                  return {
                    price: itemPrice.price,
                    productId: item.itemId,
                    productName: item.name,
                    amount: orderItem?.amount ?? 1,
                    productSizeId: itemSize.sizeId,
                  };
                }),
            ),
        ),
    );
  }

  private calculateTotal(userOrderItems: any[]): number {
    return userOrderItems.reduce(
      (sum, item) => sum + item.price * item.amount,
      0,
    );
  }

  private async getTerminalGroupId(
    organizationId: string,
    terminalId?: string,
  ): Promise<string> {
    if (terminalId) {
      const terminal = await this.prisma.iikoTerminal.findUnique({
        where: { id: terminalId, organizationId },
        select: { terminalGroupId: true },
      });

      if (terminal?.terminalGroupId) return terminal.terminalGroupId;
    }

    const terminalGroup = await this.iikoService.getTerminalGroup(
      organizationId,
    );

    if (terminalGroup) return terminalGroup.items[0].id;

    return iikoConfig.TERMINAL_GROUP_ID;
  }

  private async createIikoOrder(user: JwtPayload, userOrder: UserOrderOutput) {
    const paymentData = this.createPaymentData(user, userOrder);

    const iikoOrderInput = this.buildIikoOrderInput(
      userOrder,
      paymentData,
      user,
    );

    try {
      const { orderInfo } = await this.iikoService.createOrder(iikoOrderInput);
      return this.updateUserOrderWithIikoInfo(userOrder, orderInfo.id);
    } catch (err) {
      return this.updateUserOrderWithError(userOrder);
    }
  }

  private createPaymentData(user: JwtPayload, userOrder: UserOrderOutput) {
    return userOrder.type === UserOrderType.Takeaway
      ? {
          paymentTypeKind: 'Card',
          sum: userOrder.total,
          paymentTypeId: iikoConfig.APP_PAYMENT_TYPE_ID,
          isProcessedExternally: true,
          paymentAdditionalData: null,
          isFiscalizedExternally: true,
          isPrepay: false,
        }
      : {
          paymentTypeKind: 'LoyaltyCard',
          sum: userOrder.total,
          paymentTypeId: iikoConfig.BONUS_PAYMENT_TYPE_ID,
          isProcessedExternally: false,
          paymentAdditionalData: {
            searchScope: 'Phone',
            credential: user.phone,
            type: 'LoyaltyCard',
          },
          isFiscalizedExternally: false,
          isPrepay: false,
        };
  }

  private buildIikoOrderInput(
    userOrder: UserOrderOutput,
    paymentData: any,
    user: JwtPayload,
  ) {
    const phone = formatPhone(user.phone);
    return {
      organizationId: userOrder.organizationId,
      terminalGroupId: userOrder.terminalGroupId,
      order: {
        items: userOrder.userOrderItem.map((orderItem) => ({
          productId: orderItem.productId,
          type: 'product',
          amount: orderItem.amount,
          productSizeId: orderItem.productSizeId,
          price: orderItem.price,
        })),
        customer: { phone, name: user.name },
        phone: phone,
        externalNumber: `APP–${userOrder.orderNumber}`,
        menuId:
          userOrder.type === UserOrderType.Reward
            ? iikoConfig.REWARD_MENU_ID
            : iikoConfig.EXTERNAL_MENU_ID,
        payments: [paymentData],
        tips: null,
        sourceKey: 'Steppe APP',

        orderTypeId: iikoConfig.ORDER_TYPE_ID,
        chequeAdditionalInfo: {
          needReceipt: true,
        },
      },
      createOrderSettings: null,
    };
  }

  private async updateUserOrderWithIikoInfo(
    userOrder: UserOrderOutput,
    iikoOrderId: string,
  ) {
    return await this.prisma.userOrder.update({
      where: { id: userOrder.id },
      data: {
        iikoStatus: IikoStatus.created,
        paymentStatus: PaymentStatus.paid,
        iikoOrderId,
      },
      include: { userOrderItem: true },
    });
  }

  private async updateUserOrderWithError(userOrder: UserOrderOutput) {
    return await this.prisma.userOrder.update({
      where: { id: userOrder.id },
      data: { iikoStatus: IikoStatus.error },
      include: { userOrderItem: true },
    });
  }

  private async processPayment(
    user: JwtPayload,
    userOrder: UserOrderWithItems,
    cardId: string,
  ) {
    const invoice = await this.epayService.createEpayInvoice(
      user.id,
      EpayOrderType.UserOrder,
      userOrder.id,
    );

    const card = await this.getUserCard(user.id, cardId);

    try {
      const payment = await this.epayService.cardPayment(user.id, {
        amount: userOrder.total,
        currency: 'KZT',
        cardId: card.cardId,
        invoiceId: invoice.id,
      });

      if (payment.status !== EpayOrderStatus.paid) {
        throw new Error('Payment failed');
      }

      return this.createIikoOrder(user, userOrder);
    } catch (err) {
      await this.epayService.failInvoice(user.id, invoice.id);

      return await this.prisma.userOrder.update({
        where: { id: userOrder.id },
        data: { paymentStatus: PaymentStatus.failed },
        include: { userOrderItem: true },
      });
    }
  }

  private async getUserCard(userId: string, cardId: string) {
    return this.prisma.epayUserCard.findFirstOrThrow({
      where: { id: cardId, accountId: userId },
    });
  }
}
