import { Field, ObjectType, ID, Float } from '@nestjs/graphql';
import { TransportPriceDto } from './transport-price.dto';
import { TransportModifierGroupDto } from './transport-modifier-group.dto';
import { NutritionInfoDto } from './nutrition-info.dto';
import GraphQLJSON from 'graphql-type-json';
// import { ButtonImageCroppedUrlDto } from '../shared/button-image-cropped-url.dto';

@ObjectType()
export class TransportItemSizeDto {
  @Field(() => [TransportPriceDto], {
    description: 'List of prices for the item size',
  })
  prices: TransportPriceDto[];

  @Field(() => [TransportModifierGroupDto], {
    description: 'List of modifier groups for the item size',
  })
  itemModifierGroups: TransportModifierGroupDto[];

  @Field(() => String, {
    description:
      'Unique size code, consists of the product code and the name of the size',
  })
  sku: string;

  @Field(() => String, { description: 'Size code' })
  sizeCode: string;

  @Field(() => String, {
    description: 'Name of the product size',
    nullable: true,
  })
  sizeName?: string;

  @Field(() => Boolean, { description: 'Whether it is the default size' })
  isDefault: boolean;

  @Field(() => Float, { description: "Size's weight", nullable: true })
  portionWeightGrams?: number;

  @Field(() => ID, {
    description:
      'Size ID, can be empty if the default size is selected and it is the only size',
    nullable: true,
  })
  sizeId: string;

  @Field(() => NutritionInfoDto, {
    description: 'Nutritional information per 100 grams',
    nullable: true,
  })
  nutritionPerHundredGrams?: NutritionInfoDto;

  @Field(() => String, { description: 'Links to button image', nullable: true })
  buttonImageUrl?: string;

  @Field(() => GraphQLJSON, {
    description: 'Links to cropped button images',
    nullable: true,
  })
  buttonImageCroppedUrl?: typeof GraphQLJSON;
}
