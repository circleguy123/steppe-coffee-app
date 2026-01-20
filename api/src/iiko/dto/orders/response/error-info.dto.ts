import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorCode } from './error-code.enum';

@ObjectType({ description: 'DTO for error details transfer.' })
export class ErrorInfo {
  @Field(() => ErrorCode, { description: 'Error code.' })
  code: ErrorCode;

  @Field(() => String, { nullable: true, description: 'Localized message.' })
  message?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Localized message. (deprecated)',
    deprecationReason: 'Use "message" instead.',
  })
  description?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Additional information.',
  })
  additionalData?: string;
}
