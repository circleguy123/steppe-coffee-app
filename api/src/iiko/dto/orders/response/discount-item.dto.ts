import { Field, ObjectType } from '@nestjs/graphql';
import { DiscountType } from './discount-type.enum'; // Assuming DiscountType is an enum
import { PositionWithSum } from './position-with-sum.dto'; // Assuming PositionWithSum is another DTO

@ObjectType({ description: 'Discount.' })
export class DiscountItem {
  @Field(() => DiscountType, { description: 'Discount type.' })
  discountType: DiscountType;

  @Field(() => Number, { description: 'Total amount for discount.' })
  sum: number;

  @Field(() => [String], {
    nullable: true,
    description: 'Order item positions.',
  })
  selectivePositions?: string[];

  @Field(() => [PositionWithSum], {
    nullable: true,
    description: 'Order item positions with position discount sum.',
  })
  selectivePositionsWithSum?: PositionWithSum[];
}
