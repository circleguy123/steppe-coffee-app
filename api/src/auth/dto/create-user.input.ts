import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsPhoneUnique } from '../validators/unique-phone.validator';

@InputType()
export class CreateUserInput {
  @Field({ description: 'Номер телефона' })
  @IsNotEmpty()
  @IsPhoneUnique()
  phone: string;

  @Field({ description: 'Имя' })
  @IsNotEmpty()
  name: string;

  @Field(() => String, {
    nullable: true,
    description: 'In the dd.mm.yyyy format',
  })
  @IsOptional()
  birthday: string;
}
