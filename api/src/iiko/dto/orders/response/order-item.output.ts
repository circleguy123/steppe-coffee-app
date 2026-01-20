import { Field, ObjectType, Int, Float, ID } from '@nestjs/graphql';
import {
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { OrderItemStatus } from './order-item-status.enum'; // Define this enum based on the referenced `OrderItemStatus`
import { ProductSize } from './product-size.dto'; // Define this DTO based on the referenced `ProductSize`
import { ComboItemInformation } from './combo-item-information.dto'; // Define this DTO based on the referenced `ComboItemInformation`
import { ItemDeletedInfo } from './item-deleted-info.dto'; // Define this DTO based on the referenced `ItemDeletedInfo`

@ObjectType({ description: 'Order item.' })
export class OrderItemOutput {
  @Field(() => String, {
    description: 'Item type (e.g., Product, Compound, Service).',
  })
  @IsString()
  type: string;

  @Field(() => OrderItemStatus, { description: 'Item cooking status.' })
  @IsOptional()
  @IsString()
  status: OrderItemStatus;

  @Field(() => Boolean, { description: 'Indicates if the item is deleted.' })
  @IsOptional()
  @IsBoolean()
  deleted?: boolean;

  @Field(() => Float, { description: 'Quantity of the item.' })
  @IsNumber()
  amount: number;

  @Field(() => String, { description: 'Comment related to the order item.' })
  @IsOptional()
  @IsString()
  comment?: string;

  @Field(() => String, {
    description: 'Item printing time (local for terminal).',
  })
  @IsOptional()
  @IsDateString()
  whenPrinted?: string;

  @Field(() => ProductSize, {
    description: 'Size of the product if applicable.',
  })
  @IsOptional()
  size?: ProductSize;

  @Field(() => ComboItemInformation, {
    description: 'Details about combo, if item is part of a combo.',
  })
  @IsOptional()
  comboInformation?: ComboItemInformation;

  @Field(() => ItemDeletedInfo, {
    description: 'Details if the item was deleted.',
  })
  @IsOptional()
  deletedInfo?: ItemDeletedInfo;
}
