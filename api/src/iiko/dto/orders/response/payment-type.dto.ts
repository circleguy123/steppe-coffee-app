import { Field, ObjectType } from '@nestjs/graphql';
import { PaymentTypeKind } from './payment-type-kind.enum'; // Assuming you have an enum for PaymentTypeKind

@ObjectType({
  description:
    'Payment type. Can be obtained by `/api/1/payment_types` operation.',
})
export class PaymentType {
  @Field(() => String, { description: 'ID.' })
  id: string;

  @Field(() => String, { description: 'Name.' })
  name: string;

  @Field(() => PaymentTypeKind, { description: 'Payment type classifier.' })
  kind: PaymentTypeKind;
}
