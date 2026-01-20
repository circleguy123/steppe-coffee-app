import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCustomerInput {
  @Field(() => String, { description: 'Customer ID.', nullable: true })
  id?: string;

  @Field(() => String, {
    description: 'Customer phone. Can be null.',
    nullable: true,
  })
  phone?: string;

  @Field(() => String, {
    description: 'Card track. Required if cardNumber set. Can be null.',
    nullable: true,
  })
  cardTrack?: string;

  @Field(() => String, {
    description: 'Card number. Required if cardTrack set. Can be null.',
    nullable: true,
  })
  cardNumber?: string;

  @Field(() => String, {
    description: 'Customer name. Can be null.',
    nullable: true,
  })
  name?: string;

  @Field(() => String, {
    description: 'Customer middle name. Can be null.',
    nullable: true,
  })
  middleName?: string;

  @Field(() => String, {
    description: 'Customer surname. Can be null.',
    nullable: true,
  })
  surName?: string;

  @Field(() => String, {
    description: 'Customer birthday.',
    nullable: true,
    // example: '2019-08-24 14:15:22.123',
  })
  birthday?: string;

  @Field(() => String, {
    description: 'Customer email. Can be null.',
    nullable: true,
  })
  email?: string;

  @Field(() => Int, {
    description:
      'Customer sex.\r\n<br>0 - not specified,<br />1 - male,<br />2 - female.',
    nullable: true,
  })
  sex?: number;

  @Field(() => Int, {
    description:
      'Customer consent status.\r\n<br>0 - unknown,<br />1 - given,<br />2 - revoked.',
    nullable: true,
  })
  consentStatus?: number;

  @Field(() => Boolean, {
    description: 'Customer get promo messages (email, sms). If null - unknown.',
    nullable: true,
  })
  shouldReceivePromoActionsInfo?: boolean;

  @Field(() => String, {
    description:
      'Id for referrer guest. Null for old integrations, Guid.Empty - for referrer deletion. Can be null.',
    nullable: true,
  })
  referrerId?: string;

  @Field(() => String, {
    description: 'Customer user data. Can be null.',
    nullable: true,
  })
  userData?: string;

  @Field(() => String, { description: 'Customer organization id.' })
  organizationId: string;
}
