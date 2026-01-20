import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

@InputType()
export class RegularCustomer {
  @Field({
    description:
      'Existing customer ID in RMS. If null, the phone number is searched in database; otherwise, a new customer is created in RMS.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @Field({
    description: 'Guest phone. Allowed from version `7.5.2`.',
    nullable: true,
  })
  phone?: string;

  @Field({
    description:
      'Name of customer. Required for new customers (if "id" == null). Not required if "id" is specified.',
    nullable: true,
  })
  @ValidateIf((o) => !o.id)
  @IsString()
  @MaxLength(60)
  name?: string;

  @Field({ description: 'Last name.', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  surname?: string;

  @Field({ description: 'Comment.', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  comment?: string;

  @Field({ description: 'Date of birth.', nullable: true })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'Birthdate must be in the format yyyy-MM-dd HH:mm:ss.fff' },
  )
  birthdate?: string;

  @Field({ description: 'Email.', nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({
    description:
      'Whether customer receives order status notification messages.',
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  shouldReceiveOrderStatusNotifications?: boolean;

  @Field({
    description:
      'Deprecated, use "shouldReceiveOrderStatusNotifications" instead.',
    nullable: true,
    deprecationReason: 'Use "shouldReceiveOrderStatusNotifications" instead.',
  })
  @IsOptional()
  @IsBoolean()
  shouldReceivePromoActionsInfo?: boolean;

  @Field({ description: 'Gender.', nullable: true })
  @IsOptional()
  @IsString()
  gender?: string; // Assuming gender is a string. Replace with an enum or appropriate type if defined elsewhere.
}
