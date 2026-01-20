import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CroppedImageInfoDto {
  @Field(() => String, { description: 'URL of the image.' })
  url: string;

  @Field(() => String, { description: 'Hash of the image.' })
  hash: string;

  @Field(() => String, {
    nullable: true,
    description: 'Cropped image information.',
  })
  cropped?: string;
}
