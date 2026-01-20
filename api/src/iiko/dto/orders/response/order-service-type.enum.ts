import { registerEnumType } from '@nestjs/graphql';

export enum OrderServiceType {
  DineIn = 'DineIn',
  TakeOut = 'TakeOut',
  Delivery = 'Delivery',
  // Add other types as needed
}

registerEnumType(OrderServiceType, {
  name: 'OrderServiceType',
  description: 'Service type of the order.',
});
