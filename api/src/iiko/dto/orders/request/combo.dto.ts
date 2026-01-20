import { Field, ObjectType, Float, Int, ID } from '@nestjs/graphql';
import { IsUUID, IsString, IsNumber, Min, IsOptional } from 'class-validator';
import { ProductSize } from './product-size.dto';

@ObjectType()
export class OrderCombo {
  @Field(() => ID, { description: 'Combo ID.' })
  @IsUUID()
  id: string;

  @Field({ description: 'Name of combo.' })
  @IsString()
  name: string;

  @Field(() => Int, { description: 'Number of combos.' })
  @IsNumber()
  @Min(0)
  amount: number;

  @Field(() => Float, {
    description: 'Price of combo. Given for 1 combo, without regard to amount.',
  })
  @IsNumber()
  price: number;

  @Field(() => ID, { description: 'Combo action ID.' })
  @IsUUID()
  sourceId: string;

  @Field(() => ProductSize, { description: 'Size of combo.', nullable: true })
  @IsOptional()
  size?: ProductSize;
}
