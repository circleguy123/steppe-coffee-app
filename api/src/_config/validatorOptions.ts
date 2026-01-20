import { GraphQLError } from 'graphql';
import { ValidationPipeOptions } from '@nestjs/common';

export const validatorOptions: ValidationPipeOptions = {
  exceptionFactory: (errors: any[]) =>
    new GraphQLError(errors.map((error) => error.message ?? error).join('\n')),
  transform: true,
  whitelist: true,
};
