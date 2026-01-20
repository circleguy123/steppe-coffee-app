import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { GuestsInfo } from './guests-info.dto'; // Replace with the correct path
import { OrderItem } from './order-item.dto'; // Replace with the correct path
import { OrderCombo } from './combo.dto'; // Replace with the correct path
import { Payment } from './payment.dto'; // Replace with the correct path
// import { TipsPayment } from './tips-payment.dto'; // Replace with the correct path
// import { DiscountsInfo } from './discounts-info.dto'; // Replace with the correct path
// import { LoyaltyInfo } from './loyalty-info.dto'; // Replace with the correct path
// import { ChequeAdditionalInfo } from './cheque-additional-info.dto'; // Replace with the correct path
// import { ExternalData } from './external-data.dto'; // Replace with the correct path
import { RegularCustomer } from './regular-customer.dto'; // Replace with the correct path
import { ChequeAdditionalInfo } from './cheque-additional-info.dto';

@ObjectType()
export class TableOrder {
  @Field(() => ID, { description: 'Order ID.', nullable: true })
  id?: string;

  @Field({
    description: 'Order external number. Allowed from version `8.0.6`.',
    nullable: true,
  })
  externalNumber?: string;

  @Field(() => [ID], {
    description:
      'Table IDs. Can be obtained by `/api/1/reserve/available_restaurant_sections` operation.',
    nullable: true,
  })
  tableIds?: string[];

  @Field(() => RegularCustomer, {
    description: 'Guest. Allowed from version `7.5.2`.',
    nullable: true,
  })
  customer?: RegularCustomer;

  @Field({ description: 'Guest phone' })
  phone: string;

  @Field(() => Int, {
    description:
      'Amount of guests in the order. Allowed from version `7.6.1`. **Deprecated**',
    nullable: true,
  })
  guestCount?: number;

  @Field(() => GuestsInfo, {
    description: 'Guests information. Allowed from version `7.6.1`.',
    nullable: true,
  })
  guests?: GuestsInfo;

  @Field({
    description:
      'Tab name (only for fastfood terminals group in tab mode). Allowed from version `7.6.1`.',
    nullable: true,
  })
  tabName?: string;

  @Field({ description: 'External menu ID.', nullable: true })
  menuId?: string;

  @Field(() => [OrderItem], { description: 'Order items.' })
  items: OrderItem[];

  @Field(() => [OrderCombo], {
    description: 'Combos included in order.',
    nullable: true,
  })
  combos?: OrderCombo[];

  @Field(() => [Payment], {
    description:
      'Order payment components. Type **LoyaltyCard** allowed from version `7.1.5`.',
    nullable: true,
  })
  payments?: Payment[];

  // @Field(() => [TipsPayment], {
  //   description: 'Order tips components.',
  //   nullable: true,
  // })
  // tips?: TipsPayment[];

  @Field({
    description:
      'The string key (marker) of the source (partner - api user) that created the order. Needed to limit the visibility of orders for external integration.',
    nullable: true,
  })
  sourceKey?: string;

  // @Field(() => DiscountsInfo, {
  //   description: 'Discounts/surcharges.',
  //   nullable: true,
  // })
  // discountsInfo?: DiscountsInfo;

  // @Field(() => LoyaltyInfo, {
  //   description: 'Information about Loyalty app.',
  //   nullable: true,
  // })
  // loyaltyInfo?: LoyaltyInfo;

  @Field(() => ID, {
    description:
      'Order type ID. Can be obtained by `/api/1/deliveries/order_types` operation',
    nullable: true,
  })
  orderTypeId?: string;

  @Field(() => ChequeAdditionalInfo, {
    description: 'Cheque additional information.',
    nullable: true,
  })
  chequeAdditionalInfo?: ChequeAdditionalInfo;

  // @Field(() => [ExternalData], {
  //   description: 'Order external data. Allowed from version `8.0.6`.',
  //   nullable: true,
  // })
  // externalData?: ExternalData[];
}
