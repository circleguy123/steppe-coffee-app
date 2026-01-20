import { Field, ObjectType, ID } from '@nestjs/graphql';
import { IsUUID, IsString, IsBoolean, IsNumber } from 'class-validator';
import { PaymentAdditionalData } from './payment-additional-data.dto';

@ObjectType()
export class Payment {
  @Field({ description: 'Type of payment.' })
  @IsString()
  paymentTypeKind: string;

  @Field({ description: 'Amount due for payment.' })
  @IsNumber()
  sum: number;

  @Field(() => ID, {
    description:
      'Payment type ID. Can be obtained by `/api/1/payment_types` operation.',
  })
  @IsUUID()
  paymentTypeId: string;

  @Field({
    description:
      'Whether the payment item is processed by an external payment system.',
  })
  @IsBoolean()
  isProcessedExternally: boolean;

  @Field({ description: 'Additional payment parameters.' })
  paymentAdditionalData?: PaymentAdditionalData; // Reference to another DTO, if required

  @Field({ description: 'Whether the payment item is externally fiscalized.' })
  @IsBoolean()
  isFiscalizedExternally: boolean;

  @Field({ description: 'Whether the payment item is a prepay.' })
  @IsBoolean()
  isPrepay: boolean;
}
