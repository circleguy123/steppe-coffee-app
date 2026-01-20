import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Item size.' })
export class ProductSize {
  @Field(() => String, { description: 'ID.' })
  id: string;

  @Field(() => String, { description: 'Name.' })
  name: string;
}
