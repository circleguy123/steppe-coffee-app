import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class GuestCardInfo {
  @Field(() => ID, { description: 'Card id.' })
  id: string;

  @Field({ description: 'Card track.' })
  track: string;

  @Field({ description: 'Card number.' })
  number: string;

  @Field({ nullable: true, description: 'Card valid to date.' })
  validToDate?: string;
}
