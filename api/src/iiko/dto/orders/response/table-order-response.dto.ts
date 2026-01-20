import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { TableOrderInfo } from './table-order-info.dto'; // Adjust the import path as needed

@ObjectType()
export class TableOrderResponse {
  @Field({ description: 'Operation ID.' })
  @IsNotEmpty()
  @IsString()
  correlationId: string;

  @Field(() => TableOrderInfo, { description: 'Order.' })
  orderInfo: TableOrderInfo;
}
