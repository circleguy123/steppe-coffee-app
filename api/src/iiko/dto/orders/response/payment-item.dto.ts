import { Field, ObjectType } from '@nestjs/graphql';
import { PaymentType } from './payment-type.dto'; // Assuming you have an enum for PaymentType

@ObjectType({ description: 'Delivery order payment component.' })
export class PaymentItem {
  @Field(() => PaymentType, {
    description:
      'Payment type. Can be obtained by `/api/1/payment_types` operation.',
  })
  paymentType: PaymentType;

  @Field(() => Number, { description: 'Amount due.' })
  sum: number;

  @Field(() => Boolean, { description: 'Whether payment item is preliminary.' })
  isPreliminary: boolean;

  @Field(() => Boolean, {
    description: 'Payment item is external (created via biz.API).',
  })
  isExternal: boolean;

  @Field(() => Boolean, {
    description: 'Payment item is processed by external payment system.',
  })
  isProcessedExternally: boolean;

  @Field(() => Boolean, {
    description: 'Whether the payment item is externally fiscalized.',
    nullable: true,
  })
  isFiscalizedExternally?: boolean;

  @Field(() => Boolean, {
    description: 'Whether the payment item is prepay.',
    nullable: true,
  })
  isPrepay?: boolean;
}
