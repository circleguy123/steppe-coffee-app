import { registerEnumType } from '@nestjs/graphql';

export enum ErrorCode {
  // Add error codes here, for example:
  Unknown = 'Unknown',
  ValidationFailed = 'ValidationFailed',
  Unauthorized = 'Unauthorized',
}

registerEnumType(ErrorCode, {
  name: 'ErrorCode',
  description: 'Error code.',
});
