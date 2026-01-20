import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NutritionInfoDto {
  @Field(() => String, {
    description: 'Placeholder field for nutritional info',
    nullable: true,
  })
  placeholder?: string;
}
