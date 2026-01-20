import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';

import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

export function IsPhoneUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniquePhoneValidator,
    });
  };
}

@ValidatorConstraint({ name: 'isPhoneUnique', async: true })
@Injectable()
export class UniquePhoneValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  validate(value: string): Promise<boolean> {
    return this.prisma.user
      .findFirst({ where: { phone: value, deletedAt: null } })
      .then((user) => {
        if (user) {
          throw new GraphQLError('Телефон уже зарегестрирован');
        } else {
          return true;
        }
      });
  }
}
