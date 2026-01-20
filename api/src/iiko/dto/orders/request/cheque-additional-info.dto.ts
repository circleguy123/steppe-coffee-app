import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

@InputType()
export class ChequeAdditionalInfo {
  @Field({ description: 'Whether paper cheque should be printed.' })
  @IsBoolean()
  needReceipt: boolean;

  @Field({
    description:
      "Email to send cheque information or null if the cheque shouldn't be sent by email.",
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @Field({ description: 'Settlement place.', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  settlementPlace?: string;

  @Field({
    description:
      "Phone to send cheque information (by SMS) or null if the cheque shouldn't be sent by SMS.",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Length(8, 40)
  phone?: string;
}
