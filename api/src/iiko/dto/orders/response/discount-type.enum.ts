import { registerEnumType } from '@nestjs/graphql';

export enum DiscountType {
  PERCENTAGE = 'Percentage',
  FIXED = 'Fixed',
  PROMOTIONAL = 'Promotional',
}

registerEnumType(DiscountType, {
  name: 'DiscountType',
  description:
    'Different types of discounts (e.g., percentage, fixed, promotional)',
});
