import { Field, ObjectType, Float } from '@nestjs/graphql';

@ObjectType()
export class TaxCategoryDto {
  @Field(() => String, { description: 'Tax category ID' })
  id: string;

  @Field(() => String, { description: 'Tax category name' })
  name: string;

  @Field(() => Float, { description: 'Tax percentage', nullable: true })
  percentage?: number;
}
