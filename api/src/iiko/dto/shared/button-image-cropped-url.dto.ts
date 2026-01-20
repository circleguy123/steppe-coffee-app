import { Field, ObjectType } from '@nestjs/graphql';
import { CroppedImageInfoDto } from './cropped-image-info.dto';

@ObjectType()
export class ButtonImageCroppedUrlDto {
  @Field(() => CroppedImageInfoDto, { nullable: true })
  '475x250'?: CroppedImageInfoDto;

  @Field(() => CroppedImageInfoDto, { nullable: true })
  '475x250-webp'?: CroppedImageInfoDto;
}
