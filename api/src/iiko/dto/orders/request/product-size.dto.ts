import { Field, ObjectType, ID } from '@nestjs/graphql';
import { IsUUID, IsString } from 'class-validator';

@ObjectType()
export class ProductSize {
  @Field(() => ID, { description: 'ID of the size.' })
  @IsUUID()
  id: string;

  @Field({ description: 'Name of the size.' })
  @IsString()
  name: string;
}
