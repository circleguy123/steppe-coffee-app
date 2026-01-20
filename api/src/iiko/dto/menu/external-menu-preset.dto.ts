import { Field, ObjectType, Int } from '@nestjs/graphql';
import { TransportMenuCategoryDto } from './transport-menu-category.dto';

@ObjectType()
export class ExternalMenuPreset {
  @Field(() => Int, { description: 'ID of the external menu' })
  id: number;

  @Field(() => String, { description: 'External menu name' })
  name: string;

  @Field(() => String, {
    description: 'External menu description',
    nullable: true,
  })
  description?: string;

  @Field(() => [TransportMenuCategoryDto], {
    description: 'Categories of items in the external menu',
  })
  itemCategories: TransportMenuCategoryDto[];
}
