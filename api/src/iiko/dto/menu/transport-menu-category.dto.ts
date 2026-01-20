import { Field, ObjectType, ID } from '@nestjs/graphql';
import { TransportItemDto } from './transport-item.dto';

@ObjectType()
export class TransportMenuCategoryDto {
  @Field(() => [TransportItemDto], {
    description: 'List of items in the category',
  })
  items: TransportItemDto[];

  @Field(() => ID, { description: 'ID of the category of the external menu' })
  id: string;

  @Field(() => String, { description: 'Category name of the external menu' })
  name: string;

  @Field(() => String, { description: 'Category description', nullable: true })
  description?: string;

  @Field(() => String, { description: 'Links to images', nullable: true })
  buttonImageUrl?: string;

  @Field(() => String, {
    description: 'Description header for the images',
    nullable: true,
  })
  headerImageUrl?: string;
}
