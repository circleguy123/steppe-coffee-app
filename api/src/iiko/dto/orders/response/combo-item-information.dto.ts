import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Information on order item to combo relation.' })
export class ComboItemInformation {
  @Field(() => String, { description: 'New combo ID.' })
  comboId: string;

  @Field(() => String, { description: 'Action ID that defines combo.' })
  comboSourceId: string;

  @Field(() => String, { description: 'Combo group ID to which item belongs.' })
  groupId: string;

  @Field(() => String, {
    description: 'Combo group name to which item belongs.',
    nullable: true,
  })
  groupName?: string;
}
