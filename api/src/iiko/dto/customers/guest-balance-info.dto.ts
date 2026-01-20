import { Field, ObjectType, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class GuestBalanceInfo {
  @Field(() => ID, { description: 'Wallet id.' })
  id: string;

  @Field({ description: 'Wallet name.' })
  name: string;

  @Field({
    description:
      'Wallet type.\r\n0 - deposit or corporate nutrition,\r\n1 - bonus program,\r\n2 - products program,\r\n3 - discount program,\r\n4 - certificate program.',
  })
  type: number;

  @Field(() => Float, { description: 'Wallet balance.' })
  balance: number;
}
