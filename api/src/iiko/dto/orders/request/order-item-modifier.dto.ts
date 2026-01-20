import { Field, ObjectType, Float, ID, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsUUID, Min, Max } from 'class-validator';

@InputType('OrderItemModifierInput')
@ObjectType()
export class OrderItemModifier {
  @Field(() => ID, { description: 'Product ID.' })
  @IsUUID()
  productId: string;

  @Field(() => Float, { description: 'Quantity of the modifier.' })
  @IsNumber()
  @Min(0)
  @Max(999.999)
  amount: number;

  @Field(() => ID, {
    description: 'Group ID. Required if modifier is a group one.',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  productGroupId?: string;
}
