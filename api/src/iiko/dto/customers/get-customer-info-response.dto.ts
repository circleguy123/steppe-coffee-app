import { Field, ObjectType, ID } from '@nestjs/graphql';
import { GuestCardInfo } from './guest-card-info.dto';
import { GuestCategoryShortInfo } from './guest-category-short-info.dto';
import { GuestBalanceInfo } from './guest-balance-info.dto';

@ObjectType()
export class GetCustomerInfoResponse {
  @Field(() => ID, { description: 'Guest id.' })
  id: string;

  @Field(() => ID, { nullable: true, description: 'Guest referrer id.' })
  referrerId?: string;

  @Field({ nullable: true, description: 'Guest name.' })
  name?: string;

  @Field({ nullable: true, description: 'Guest surname.' })
  surname?: string;

  @Field({ nullable: true, description: 'Guest middle name.' })
  middleName?: string;

  @Field({ nullable: true, description: 'Guest comment.' })
  comment?: string;

  @Field({ nullable: true, description: 'Main customer phone.' })
  phone?: string;

  @Field({ nullable: true, description: 'Guest culture name.' })
  cultureName?: string;

  @Field({ nullable: true, description: 'Guest birthday.' })
  birthday?: string;

  @Field({ nullable: true, description: 'Guest email.' })
  email?: string;

  @Field(() => Number, {
    description: 'Sex: 0 - not specified, 1 - male, 2 - female.',
  })
  sex: number;

  @Field(() => Number, {
    description: 'Consent status: 0 - unknown, 1 - given, 2 - revoked.',
  })
  consentStatus: number;

  @Field({ description: 'Guest anonymized.' })
  anonymized: boolean;

  @Field(() => [GuestCardInfo], { description: 'Customer cards.' })
  cards: GuestCardInfo[];

  @Field(() => [GuestCategoryShortInfo], {
    description: 'Customer categories.',
  })
  categories: GuestCategoryShortInfo[];

  @Field(() => [GuestBalanceInfo], { description: 'Customer wallet balances.' })
  walletBalances: GuestBalanceInfo[];

  @Field({
    nullable: true,
    description: 'Technical user data, customizable by restaurateur.',
  })
  userData?: string;

  @Field({ nullable: true, description: 'Customer receives promo messages.' })
  shouldReceivePromoActionsInfo?: boolean;

  @Field({ nullable: true, description: 'Guest should receive loyalty info.' })
  shouldReceiveLoyaltyInfo?: boolean;

  @Field({
    nullable: true,
    description: 'Guest should receive order status info.',
  })
  shouldReceiveOrderStatusInfo?: boolean;

  @Field({ nullable: true, description: 'Personal data consent from.' })
  personalDataConsentFrom?: string;

  @Field({ nullable: true, description: 'Personal data consent to.' })
  personalDataConsentTo?: string;

  @Field({ nullable: true, description: 'Personal data processing from.' })
  personalDataProcessingFrom?: string;

  @Field({ nullable: true, description: 'Personal data processing to.' })
  personalDataProcessingTo?: string;

  @Field({ nullable: true, description: 'Customer marked as deleted.' })
  isDeleted?: boolean;
}
