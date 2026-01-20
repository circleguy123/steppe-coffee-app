import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GuestsInfo {
  @Field({ description: 'Guests count.' })
  count: number;
}
