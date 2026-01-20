import { IsArray, IsString } from 'class-validator';

export class TerminalGroupItemDTO {
  @IsString()
  id: string;

  @IsString()
  organizationId: string;

  @IsString()
  name: string;

  @IsString()
  timeZone: string;
}

export class TerminalGroupDTO {
  @IsString()
  organizationId: string;

  @IsArray()
  items: TerminalGroupItemDTO[];
}
