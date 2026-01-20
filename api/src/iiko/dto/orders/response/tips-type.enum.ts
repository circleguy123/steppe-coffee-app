import { registerEnumType } from '@nestjs/graphql';

export enum TipsType {
  PERCENTAGE = 'Percentage',
  FIXED = 'Fixed',
}

registerEnumType(TipsType, {
  name: 'TipsType',
  description: 'Different types of tips (e.g., percentage or fixed amount)',
});
