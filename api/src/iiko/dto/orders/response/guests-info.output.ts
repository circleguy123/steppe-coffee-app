import { Field, ObjectType, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, Min } from 'class-validator';

@ObjectType({ description: 'Information about order guests.' })
export class GuestsInfoOutput {
  @Field(() => Int, { description: 'Number of persons.' })
  @IsInt()
  @Min(0, { message: 'The number of guests must be at least 0.' })
  count: number;

  @Field(() => Boolean, {
    description:
      'Attribute that shows whether the order must be split among guests.',
  })
  @IsBoolean()
  splitBetweenPersons: boolean;
}
