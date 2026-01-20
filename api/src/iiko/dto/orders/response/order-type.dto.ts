import { Field, ObjectType, ID } from '@nestjs/graphql';
import { OrderServiceType } from './order-service-type.enum'; // Adjust the import path as needed
import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

@ObjectType({ description: 'Order type.' })
export class OrderType {
  @Field(() => ID, { description: 'ID.' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @Field({ description: 'Name.' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => OrderServiceType, { description: 'Order type.' })
  orderServiceType: OrderServiceType;
}
