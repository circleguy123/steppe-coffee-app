import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ description: 'Name' })
  @IsNotEmpty()
  name: string;

  @Field({ description: 'Surname' })
  @IsNotEmpty()
  surName: string;

  @Field({
    description: 'In the dd.mm.yyyy format',
  })
  birthDate: string;
}
