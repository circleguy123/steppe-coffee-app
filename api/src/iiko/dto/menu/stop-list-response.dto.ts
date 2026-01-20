import { Field, ObjectType } from '@nestjs/graphql';
import { TerminalGroupStopListDto } from './terminal-group-stop-list.dto';

@ObjectType()
export class StopListResponseDto {
  @Field(() => String)
  correlationId: string;

  @Field(() => [TerminalGroupStopListDto])
  terminalGroupStopLists: TerminalGroupStopListDto[];
}
