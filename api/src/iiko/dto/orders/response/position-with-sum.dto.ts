import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Order item position with discount sum.' })
export class PositionWithSum {
  @Field(() => String, { description: 'Position ID (UUID).' })
  positionId: string;

  @Field(() => Number, { description: 'Discount sum for the position.' })
  discountSum: number;
}
