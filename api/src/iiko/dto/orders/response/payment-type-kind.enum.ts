import { registerEnumType } from '@nestjs/graphql';

export enum PaymentTypeKind {
  CASH = 'Cash',
  CARD = 'Card',
  VOUCHER = 'Voucher',
  EXTERNAL = 'External',
}

registerEnumType(PaymentTypeKind, {
  name: 'PaymentTypeKind', // Name of the enum in GraphQL
  description: 'Classifier for the payment type.',
});
