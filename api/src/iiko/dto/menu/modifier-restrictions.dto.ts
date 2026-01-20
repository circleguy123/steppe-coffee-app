import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class ModifierRestrictionsDto {
  @Field(() => Int, { description: 'Minimum amount', nullable: true })
  minQuantity?: number;

  @Field(() => Int, { description: 'Maximum amount', nullable: true })
  maxQuantity?: number;

  @Field(() => Int, { description: 'Amount free of charge', nullable: true })
  freeQuantity?: number;

  @Field(() => Int, { description: 'Default amount', nullable: true })
  byDefault?: number;
}
