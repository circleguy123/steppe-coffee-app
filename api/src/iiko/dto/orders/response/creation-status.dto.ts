import { registerEnumType } from '@nestjs/graphql';

export enum CreationStatus {
  Success = 'Success',
  InProgress = 'InProgress',
  Error = 'Error',
}

registerEnumType(CreationStatus, {
  name: 'CreationStatus',
  description: 'Order creation status.',
});
