import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { EpayOrderStatus, EpayOrderType } from '@prisma/client';

registerEnumType(EpayOrderType, {
  name: 'EpayOrderType',
});

registerEnumType(EpayOrderStatus, {
  name: 'EpayOrderStatus',
});

@ObjectType()
export class EpayInvoiceOutput {
  @Field()
  id: string;

  @Field({ nullable: true })
  userOrderId?: string;

  @Field({ nullable: true })
  membershipId?: string;

  @Field(() => EpayOrderType)
  type: EpayOrderType;

  @Field()
  userId: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  paidAt?: Date;

  @Field(() => EpayOrderStatus)
  status: EpayOrderStatus;
}
