import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
} from 'class-validator';
import { OrderStatus } from './order-status.enum'; // Import your enums or other required DTOs
import { OrderType } from './order-type.dto';
import { GuestsInfoOutput } from './guests-info.output';
import { OrderItemOutput } from './order-item.output';
import { PaymentItem } from './payment-item.dto';
import { TipsPaymentItem } from './tips-payment-item.dto';
import { DiscountItem } from './discount-item.dto';
import { LoyaltyInfo } from './loyalty-info.dto';
import { ExternalDataOutput } from './external-data.output';

@ObjectType()
export class TableOrderOutput {
  @Field(() => [String])
  @IsArray()
  @IsUUID('4', { each: true })
  tableIds: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  customer?: string; // Reference to a nested object if needed

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  whenCreated?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  waiter?: string; // Reference to an Employee DTO if applicable

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  tabName?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  splitOrderBetweenCashRegisters?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  menuId?: string;

  @Field(() => Float)
  @IsNumber()
  sum: number;

  @Field(() => Int)
  @IsNumber()
  number: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  sourceKey?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  whenBillPrinted?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  whenClosed?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  conception?: string;

  @Field(() => GuestsInfoOutput, { nullable: true })
  @IsOptional()
  guestsInfo?: GuestsInfoOutput;

  @Field(() => [OrderItemOutput])
  @IsArray()
  items: OrderItemOutput[];

  @Field(() => [PaymentItem], { nullable: true })
  @IsOptional()
  @IsArray()
  payments?: PaymentItem[];

  @Field(() => [TipsPaymentItem], { nullable: true })
  @IsOptional()
  @IsArray()
  tips?: TipsPaymentItem[];

  @Field(() => [DiscountItem], { nullable: true })
  @IsOptional()
  @IsArray()
  discounts?: DiscountItem[];

  @Field(() => OrderType)
  orderType: OrderType;

  @Field(() => String)
  @IsUUID('4')
  terminalGroupId: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  processedPaymentsSum?: number;

  @Field(() => LoyaltyInfo, { nullable: true })
  @IsOptional()
  loyaltyInfo?: LoyaltyInfo;

  @Field(() => [ExternalDataOutput], { nullable: true })
  @IsOptional()
  @IsArray()
  externalData?: ExternalDataOutput[];
}
