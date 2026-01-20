import { Field, InputType, ID, Float } from '@nestjs/graphql';
import { IsNumber, IsUUID, Max, Min } from 'class-validator';

@InputType()
export class CreateUserOrderItemModifierInput {
  @Field(() => ID)
  @IsUUID()
  productId: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  @Max(999.999)
  amount: number;
}
