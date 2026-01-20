import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, IsArray } from 'class-validator';
import { CreateUserOrderItemInput } from './create-user-order-item.input';

@InputType()
export class CreateUserOrderInput {
  // @Field(() => Number)
  // @IsNumber()
  // total: number;

  // @Field(() => String)
  // @IsString()
  // userId: string;

  // @Field(() => String)
  // @IsString()
  // iikoStatus: string;

  // @Field(() => String)
  // @IsString()
  // paymentStatus: string;

  // @Field(() => String)
  // @IsString()
  // organizationId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  terminalId: string;

  // @Field(() => String)
  // @IsString()
  // menuId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  cardId: string;

  @Field(() => [CreateUserOrderItemInput], { nullable: 'itemsAndList' })
  @IsOptional()
  @IsArray()
  userOrderItem?: CreateUserOrderItemInput[];
}
