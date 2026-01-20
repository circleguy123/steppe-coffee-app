import { Field, ObjectType, ID } from '@nestjs/graphql';
import { ModifierRestrictionsDto } from './modifier-restrictions.dto';
import { TransportModifierItemDto } from './transport-modifier-item.dto';

@ObjectType()
export class TransportModifierGroupDto {
  @Field(() => [TransportModifierItemDto], {
    description: 'List of modifier items',
  })
  items: TransportModifierItemDto[];

  @Field(() => String, { description: 'Modifiers group name' })
  name: string;

  @Field(() => String, {
    description: 'Modifiers group description',
    nullable: true,
  })
  description?: string;

  @Field(() => ModifierRestrictionsDto, {
    description: 'Restrictions applied to the modifier group',
  })
  restrictions: ModifierRestrictionsDto;

  @Field(() => Boolean, { description: 'Whether the modifier can be split' })
  canBeDivided: boolean;

  @Field(() => ID, { description: 'Modifiers group ID' })
  itemGroupId: string;

  @Field(() => Boolean, {
    description:
      'Whether child modifiers can have their own restrictions, or only group ones',
  })
  childModifiersHaveMinMaxRestrictions: boolean;

  @Field(() => String, { description: 'Modifiers group code', nullable: true })
  sku?: string;
}
