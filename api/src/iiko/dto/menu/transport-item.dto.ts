import { Field, ObjectType, ID } from '@nestjs/graphql';
import { TransportItemSizeDto } from './transport-item-size.dto';
import { AllergenGroupDto } from './allergen-group.dto';
import { TaxCategoryDto } from './tax-category.dto';

@ObjectType()
export class TransportItemDto {
  @Field(() => [TransportItemSizeDto], { description: 'List of item sizes' })
  itemSizes: TransportItemSizeDto[];

  @Field(() => String, { description: 'Product code', nullable: true })
  sku?: string;

  @Field(() => String, { description: 'Product name', nullable: true })
  name?: string;

  @Field(() => String, { description: 'Product description', nullable: true })
  description?: string;

  @Field(() => [AllergenGroupDto], {
    description: 'List of allergen groups',
    nullable: true,
  })
  allergenGroups?: AllergenGroupDto[];

  @Field(() => ID, { description: 'Product ID' })
  itemId: string;

  @Field(() => ID, { description: 'Modifier schema ID', nullable: true })
  modifierSchemaId?: string;

  @Field(() => TaxCategoryDto, { description: 'Tax category', nullable: true })
  taxCategory?: TaxCategoryDto;

  @Field(() => String, {
    description: 'Product or compound. Depends on modifiers scheme existence',
  })
  orderItemType: 'Product' | 'Compound';
}
