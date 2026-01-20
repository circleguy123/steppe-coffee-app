import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateTableOrderSettings {
  @Field({ description: 'Auto service print is needed.', nullable: true })
  servicePrint?: boolean;

  @Field({
    description:
      "Timeout in seconds that specifies how much time is given for order to reach iikoFront. After this time, order is nullified if iikoFront doesn't take it. By default - 8 seconds.",
    nullable: true,
  })
  transportToFrontTimeout?: number;

  @Field({
    description:
      "Flag indicating whether there's need to check order items in out-of-stock list. Unable if `terminalGroupId` is null.",
    nullable: true,
  })
  checkStopList?: boolean;
}
