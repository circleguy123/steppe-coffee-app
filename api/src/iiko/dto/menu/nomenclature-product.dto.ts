import { Field, ObjectType, ID, Float } from '@nestjs/graphql';
import { ModifierDto } from './modifier.dto';

@ObjectType()
export class NomenclatureProductDto {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [ModifierDto])
  modifiers: ModifierDto[];

  @Field(() => [ModifierDto])
  groupModifiers: ModifierDto[];
}
