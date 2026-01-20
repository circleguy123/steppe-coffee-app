import { Field, ObjectType } from '@nestjs/graphql';
import { NomenclatureProductDto } from './nomenclature-product.dto';

@ObjectType()
export class NomenclatureResponseDto {
  @Field(() => [NomenclatureProductDto])
  products: NomenclatureProductDto[];
}
