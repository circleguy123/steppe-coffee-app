import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class RetryUserOrderPaymentInput {
  @Field(() => String)
  @IsString()
  userOrderId: string;

  @Field(() => String)
  @IsString()
  cardId: string;
}
