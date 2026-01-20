import { Field, ObjectType, ID } from '@nestjs/graphql';
import { StopListGroupDto } from './stop-list-group.dto';

@ObjectType()
export class TerminalGroupStopListDto {
  @Field(() => ID, { description: 'Organization ID' })
  organizationId: string;

  @Field(() => [StopListGroupDto], { description: 'Terminal group stop lists' })
  items: StopListGroupDto[];
}
