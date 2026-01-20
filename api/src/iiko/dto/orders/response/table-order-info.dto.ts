import { Field, ObjectType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
} from 'class-validator';
import { CreationStatus } from './creation-status.dto'; // Adjust the import path as needed
import { ErrorInfo } from './error-info.dto'; // Adjust the import path as needed
import { TableOrderOutput } from './table-order.output'; // Adjust the import path as needed

@ObjectType()
export class TableOrderInfo {
  @Field({ description: 'Order ID.' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @Field({ description: 'POS order ID.', nullable: true })
  @IsOptional()
  @IsUUID()
  posId?: string;

  @Field({ description: 'Order external number.', nullable: true })
  @IsOptional()
  @IsString()
  externalNumber?: string;

  @Field({ description: 'Organization ID.' })
  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @Field(() => Int, {
    description:
      'Timestamp of most recent order change that took place on iikoTransport server.',
  })
  @IsNotEmpty()
  @IsInt()
  timestamp: number;

  @Field(() => CreationStatus, { description: 'Order creation status.' })
  creationStatus: CreationStatus;

  @Field(() => ErrorInfo, {
    description: 'Order creation error details.',
    nullable: true,
  })
  @IsOptional()
  errorInfo?: ErrorInfo;

  @Field(() => TableOrderOutput, {
    description: 'Order creation details.',
    nullable: true,
  })
  @IsOptional()
  order?: TableOrderOutput;
}
``;
