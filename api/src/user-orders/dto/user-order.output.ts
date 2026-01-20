import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { UserOrder } from '../entities/user-order.entity';
import { UserOrderItemOutput } from './user-order-item.output';

@ObjectType({ description: 'User Order' })
export class UserOrderOutput extends OmitType(UserOrder, [
  'userOrderItem',
  'user',
]) {
  @Field(() => [UserOrderItemOutput])
  userOrderItem: UserOrderItemOutput[];
}
