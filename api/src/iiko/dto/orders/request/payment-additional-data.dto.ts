import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class PaymentAdditionalData {
  @Field({ description: 'Type of payment additional data.' })
  @IsString()
  type: string;

  // Additional specific fields for each payment type can be included in their respective DTOs,
  // for example, LoyaltyCardPaymentAdditionalData or CardPaymentAdditionalData.
}
