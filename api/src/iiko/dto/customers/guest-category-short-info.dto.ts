import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class GuestCategoryShortInfo {
  @Field(() => ID, { description: 'Category id.' })
  id: string;

  @Field({ description: 'Category name.' })
  name: string;

  @Field({ description: 'Is category active or not.' })
  isActive: boolean;

  @Field({ description: 'Is category default for new guests or not.' })
  isDefaultForNewGuests: boolean;
}
