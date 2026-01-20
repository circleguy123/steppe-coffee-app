import { Field, ObjectType, ID, Float } from '@nestjs/graphql';
import { TransportPriceDto } from './transport-price.dto';
import { ModifierRestrictionsDto } from './modifier-restrictions.dto';
import { AllergenGroupDto } from './allergen-group.dto';
import { NutritionInfoDto } from './nutrition-info.dto';
import { TagDto } from './tag.dto';

@ObjectType()
export class TransportModifierItemDto {
  @Field(() => [TransportPriceDto], { description: 'List of modifier prices' })
  prices: TransportPriceDto[];

  @Field(() => String, { description: "Modifier's code", nullable: true })
  sku?: string;

  @Field(() => String, { description: "Modifier's name" })
  name: string;

  @Field(() => String, {
    description: "Modifier's description",
    nullable: true,
  })
  description?: string;

  @Field(() => String, { description: 'Links to images', nullable: true })
  buttonImage?: string;

  @Field(() => ModifierRestrictionsDto, {
    description: 'Restrictions applied to the modifier',
    nullable: true,
  })
  restrictions?: ModifierRestrictionsDto;

  @Field(() => [AllergenGroupDto], {
    description: 'List of allergen groups',
    nullable: true,
  })
  allergenGroups?: AllergenGroupDto[];

  @Field(() => NutritionInfoDto, {
    description: 'Nutritional information per 100 grams',
    nullable: true,
  })
  nutritionPerHundredGrams?: NutritionInfoDto;

  @Field(() => Float, {
    description: "Modifier's weight in grams",
    nullable: true,
  })
  portionWeightGrams?: number;

  @Field(() => [TagDto], {
    description: 'List of tags associated with the modifier',
    nullable: true,
  })
  tags?: TagDto[];

  @Field(() => ID, { description: "Modifier's ID" })
  itemId: string;
}
