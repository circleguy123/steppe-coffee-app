import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Represents a user membership.' })
export class Membership {
  @Field(() => String, { description: 'Unique identifier for membership.' })
  id: string;

  @Field(() => String, { description: 'User ID associated with membership.' })
  userId: string;

  @Field(() => Date, { description: 'Date and time membership was activated.' })
  activatedAt: Date;

  @Field(() => Date, { description: 'Date and time membership will expire.' })
  expiresAt: Date;

  @Field(() => String, { description: 'Membership status.' })
  status: string;

  @Field(() => String, { description: 'Product ID for membership.' })
  productId: string;

  @Field(() => Number, { description: 'Total cost of membership.' })
  total: number;

  @Field(() => String, { description: 'Card ID used to buy membership.' })
  cardId: string;

  @Field(() => Date, { description: 'Date and time membership was created.' })
  createdAt: Date;
}
