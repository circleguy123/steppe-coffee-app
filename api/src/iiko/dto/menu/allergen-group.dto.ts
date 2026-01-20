import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class AllergenGroupDto {
  @Field(() => ID, { description: 'Allergen group ID' })
  id: string;

  @Field(() => String, { description: "Allergen's code", nullable: true })
  code?: string;

  @Field(() => String, { description: "Allergen's name" })
  name: string;
}
