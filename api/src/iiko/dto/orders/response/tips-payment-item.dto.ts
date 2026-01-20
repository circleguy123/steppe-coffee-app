import { Field, ObjectType } from '@nestjs/graphql';
import { TipsType } from './tips-type.enum'; // Assuming TipsType is an enum
import { PaymentType } from './payment-type.dto'; // Assuming PaymentType is another DTO

@ObjectType({ description: 'Delivery order tips payment component.' })
export class TipsPaymentItem {
  @Field(() => TipsType, { nullable: true, description: 'Tips type.' })
  tipsType?: TipsType;

  @Field(() => PaymentType, { description: 'Payment type.' })
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
  })
  isFiscalizedExternally: boolean;

  @Field(() => Boolean, { description: 'Whether the payment item is prepay.' })
  isPrepay: boolean;
}
