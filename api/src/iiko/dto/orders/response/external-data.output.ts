import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Order external data.' })
export class ExternalDataOutput {
  @Field(() => String, { description: 'Key.' })
  key: string;

  @Field(() => String, { description: 'Public.' })
  value: string;
}
