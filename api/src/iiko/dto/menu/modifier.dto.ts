import { Field, ObjectType, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class ModifierDto {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  defaultAmount: number;

  @Field(() => Float)
  minAmount: number;

  @Field(() => Float)
  maxAmount: number;
}
