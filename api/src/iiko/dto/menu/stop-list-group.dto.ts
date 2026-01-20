import { Field, ObjectType, ID } from '@nestjs/graphql';
import { StopListItemDto } from './stop-list-item.dto';

@ObjectType()
export class StopListGroupDto {
  @Field(() => ID, { description: 'Terminal group ID' })
  terminalGroupId: string;

  @Field(() => [StopListItemDto], { description: 'List of stopped products' })
  items: StopListItemDto[];
}
