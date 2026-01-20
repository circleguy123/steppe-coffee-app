import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Menu {
  @Field(() => String, { description: 'ID of the external menu' })
  id: string;

  @Field(() => String, { description: 'Name of the external menu' })
  name: string;
}
