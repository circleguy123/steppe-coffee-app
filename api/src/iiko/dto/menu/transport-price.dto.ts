import { Field, ObjectType, Float } from '@nestjs/graphql';

@ObjectType()
export class TransportPriceDto {
  @Field(() => String, { description: 'Organization ID' })
  organizationId: string;

  @Field(() => Float, {
    description:
      'Product size prices for the organization. If the value is null, then the product/size is not for sale. The price always belongs to the price category selected at the time of the request.',
    nullable: true,
  })
  price?: number;
}
