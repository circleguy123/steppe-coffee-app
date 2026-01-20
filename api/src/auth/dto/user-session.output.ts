import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserSessionOutput {
  @Field({ description: 'JWT токен для доступа к API' })
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
