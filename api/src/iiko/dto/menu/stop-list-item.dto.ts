import { Field, ObjectType, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class StopListItemDto {
  @Field(() => ID, { description: 'ID of the product that is out of stock' })
  productId: string;

  @Field(() => String, { nullable: true, description: 'Size ID if applicable' })
  sizeId?: string;

  @Field(() => String, { nullable: true, description: 'SKU of the item' })
  sku?: string;

  @Field(() => Int, {
    description: 'Remaining balance (should be 0 if in stop list)',
  })
  balance: number;

  @Field(() => String, {
    nullable: true,
    description: 'Date the item was added to stop list',
  })
  dateAdd?: string;
}
