import { Field, ObjectType, ID } from '@nestjs/graphql';
import { TableOrder } from './table-order.dto'; // Replace with the correct path
import { CreateTableOrderSettings } from './create-table-order-settings.dto'; // Replace with the correct path

@ObjectType()
export class CreateTableOrderRequest {
  @Field(() => ID, {
    description:
      'Organization ID. Can be obtained by `/api/1/organizations` operation.',
  })
  organizationId: string;

  @Field(() => ID, {
    description:
      'Front group ID an order must be sent to. Can be obtained by `/api/1/terminal_groups` operation.',
  })
  terminalGroupId: string;

  @Field(() => TableOrder, { description: 'Order.' })
  order: TableOrder;

  @Field(() => CreateTableOrderSettings, {
    description: 'Order creation parameters.',
    nullable: true,
  })
  createOrderSettings?: CreateTableOrderSettings;
}
