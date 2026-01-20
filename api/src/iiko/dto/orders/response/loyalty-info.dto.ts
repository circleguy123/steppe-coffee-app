import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Information about Loyalty app.' })
export class LoyaltyInfo {
  @Field(() => String, {
    nullable: true,
    description:
      'Coupon No. that was considered when calculating loyalty program.',
  })
  coupon?: string;

  @Field(() => [String], {
    nullable: true,
    description: 'Information about applied manual conditions.',
  })
  appliedManualConditions?: string[];
}
