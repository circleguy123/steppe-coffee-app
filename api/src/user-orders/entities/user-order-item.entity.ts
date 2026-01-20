import { Field, ObjectType } from '@nestjs/graphql';
import { UserOrder } from './user-order.entity'; // Adjust the import path as needed

@ObjectType({ description: 'Represents an item in a user order.' })
export class UserOrderItem {
  @Field(() => String, { description: 'Unique identifier for the order item.' })
  id: string;

  @Field(() => String, { description: 'Product ID associated with the item.' })
  productId: string;

  @Field(() => String, {
    description: 'Product name associated with the item.',
  })
  productName: string;

  @Field(() => Number, { description: 'Quantity of the product in the order.' })
  amount: number;

  @Field(() => Number, { description: 'Price of the item.' })
  price: number;

  @Field(() => String, {
    nullable: true,
    description: 'Product size ID associated with the item.',
  })
  productSizeId?: string;

  @Field(() => String, {
    description: 'User order ID to which this item belongs.',
  })
  userOrderId: string;

  @Field(() => UserOrder, {
    description: 'The user order this item is part of.',
  })
  userOrder: UserOrder;
}
