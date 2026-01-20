import { Field, ObjectType, Float, ID, InputType } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { OrderItemModifier } from './order-item-modifier.dto';

@InputType('OrderItemInput')
@ObjectType()
export class OrderItem {
  @Field({ description: 'Type of the order item.' })
  @IsString()
  type: string;

  @Field(() => Float, { description: 'Quantity of the order item.' })
  @IsNumber()
  @Min(0)
  @Max(999.999)
  amount: number;

  @Field(() => ID, {
    description: 'Size ID. Required if a stock list item has a size scale.',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  productSizeId?: string;

  @Field(() => String, {
    description: 'Combo details if combo includes order item.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  comboInformation?: string;

  @Field({ description: 'Comment related to the order item.', nullable: true })
  @IsOptional()
  @IsString()
  comment?: string;

  @Field(() => [OrderItemModifier], {
    description: 'List of modifiers for the order item.',
    nullable: true,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderItemModifier)
  modifiers?: OrderItemModifier[];
}
