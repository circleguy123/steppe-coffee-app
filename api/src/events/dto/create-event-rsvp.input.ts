import { InputType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateEventRsvpInput {
  @Field(() => String, { description: 'ID of the event to RSVP to' })
  @IsUUID()
  eventId: string;
}
