import { Field, ObjectType } from '@nestjs/graphql';
import { Event } from './event.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class EventRsvp {
  @Field(() => String, { description: 'Unique identifier for the RSVP.' })
  id: string;

  @Field(() => String, { description: 'User ID who made the RSVP.' })
  userId: string;

  @Field(() => String, { description: 'Event ID for which the RSVP is made.' })
  eventId: string;

  @Field(() => Date, { description: 'Date and time when the RSVP was made.' })
  reservedAt: Date;

  @Field(() => User, { description: 'User who made the RSVP.' })
  user: User;

  @Field(() => Event, { description: 'Event for which the RSVP is made.' })
  event: Event;
}
