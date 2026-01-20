import { Field, InputType, ID } from '@nestjs/graphql';
import { IsNumber, IsUUID, IsOptional, ValidateNested } from 'class-validator';
import { CreateUserOrderItemModifierInput } from './create-user-order-item-modifier.input';
import { Type } from 'class-transformer';

@InputType()
export class CreateUserOrderItemInput {
  @Field(() => ID)
  @IsUUID()
  productId: string;

  @Field(() => Number)
  @IsNumber()
  amount: number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  productSizeId?: string;

  @Field(() => [CreateUserOrderItemModifierInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateUserOrderItemModifierInput)
  modifiers?: CreateUserOrderItemModifierInput[];
}
