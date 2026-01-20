import { registerEnumType } from '@nestjs/graphql';

export enum OrderItemStatus {
  ADDED = 'Added',
  PRINTED_NOT_COOKING = 'PrintedNotCooking',
  COOKING_STARTED = 'CookingStarted',
  COOKING_COMPLETED = 'CookingCompleted',
  SERVED = 'Served',
}

registerEnumType(OrderItemStatus, {
  name: 'OrderItemStatus', // The name of the enum in GraphQL schema
  description: 'Order item status', // Description of the enum for GraphQL
});
