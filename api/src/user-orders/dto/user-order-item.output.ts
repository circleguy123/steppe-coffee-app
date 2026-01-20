import { ObjectType, OmitType } from '@nestjs/graphql';
import { UserOrderItem } from '../entities/user-order-item.entity';

@ObjectType({ description: 'User Order Item' })
export class UserOrderItemOutput extends OmitType(UserOrderItem, [
  'userOrder',
]) {}
