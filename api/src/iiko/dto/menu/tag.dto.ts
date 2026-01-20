import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TagDto {
  @Field(() => String, { description: 'Tag ID' })
  id: string;

  @Field(() => String, { description: 'Tag name' })
  name: string;
}
