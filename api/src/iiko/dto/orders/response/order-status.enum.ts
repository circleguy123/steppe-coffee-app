import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  New = 'New',
  Bill = 'Bill',
  Closed = 'Closed',
  Deleted = 'Deleted',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Describes the status of an order.',
});
