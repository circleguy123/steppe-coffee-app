import { Field, ObjectType } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';

export enum DeletionMethod {
  MANUAL = 'Manual',
  AUTOMATIC = 'Automatic',
  CANCELLED = 'Cancelled',
}

registerEnumType(DeletionMethod, {
  name: 'DeletionMethod',
  description: 'Method used for item deletion',
});

@ObjectType({ description: 'Order cancellation details.' })
export class ItemDeletedInfo {
  @Field(() => DeletionMethod, { description: 'Deletion method.' })
  deletionMethod: DeletionMethod;
}
