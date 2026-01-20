import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class EpayUserCard {
  @Field({ description: 'ID' })
  id: string;

  @Field({ description: 'Masked card number' })
  cardMask: string;

  @Field({ description: 'Card type (e.g., VISA, MASTERCARD)' })
  cardType: string;

  @Field({ description: 'Card issuer bank' })
  issuer: string;
}
