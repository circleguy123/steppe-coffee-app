import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserOrderItem } from './user-order-item.entity'; // Adjust the import path as needed
import { User } from 'src/users/entities/user.entity';
import { UserOrderType } from '@prisma/client';

registerEnumType(UserOrderType, {
  name: 'UserOrderType',
  description: 'Type of order that user had placed',
});

@ObjectType({ description: 'Represents a user order.' })
export class UserOrder {
  @Field(() => String, { description: 'Unique identifier for the order.' })
  id: string;

  @Field(() => Number, { description: 'Total amount of the order.' })
  total: number;

  @Field(() => String, { description: 'User ID associated with the order.' })
  userId: string;

  @Field(() => User, { description: 'User associated with the order.' })
  user: User;

  @Field(() => String, { description: 'Iiko status of the order.' })
  iikoStatus: string;

  @Field(() => String, { description: 'Payment status of the order.' })
  paymentStatus: string;

  @Field(() => String, {
    description: 'Organization ID associated with the order.',
  })
  organizationId: string;

  @Field(() => String, { description: 'Iiko Order Id', nullable: true })
  iikoOrderId: string;

  @Field(() => String, {
    description: 'Terminal group ID associated with the order.',
  })
  terminalGroupId: string;

  @Field(() => String, { description: 'Menu ID associated with the order.' })
  menuId: string;

  @Field(() => [UserOrderItem], {
    description: 'List of items in the user order.',
  })
  userOrderItem: UserOrderItem[];

  @Field(() => UserOrderType)
  type: UserOrderType = UserOrderType.Takeaway;

  @Field(() => Int, { description: 'Human readable order number' })
  orderNumber: number;

  @Field(() => Date, { description: 'Date and time the order was created.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date and time the order was updated.' })
  updatedAt: Date;
}
