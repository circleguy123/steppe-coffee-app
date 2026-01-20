import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EventRsvp } from './event-rsvp.entity';

@ObjectType()
export class Event {
  @Field(() => String, { description: 'Unique identifier for the event.' })
  id: string;

  @Field(() => String, { description: 'Title of the event.' })
  title: string;

  @Field(() => String, { description: 'Description of the event.' })
  description: string;

  @Field(() => Date, { description: 'Date and time of the event.' })
  eventDate: Date;

  @Field(() => String, {
    description: 'Length of the event in a readable format.',
  })
  eventLength: string;

  @Field(() => Int, {
    description: 'Number of tickets available for the event.',
  })
  ticketsNumber: number;

  @Field(() => String, {
    nullable: true,
    description: 'URL to the event photo.',
  })
  photoUrl?: string;

  @Field(() => Int, { description: 'Price of the event ticket.' })
  price: number;

  @Field(() => String, {
    nullable: true,
    description: 'Location of the event.',
  })
  location?: string;

  @Field(() => String, {
    nullable: true,
    description: 'URL to the event website.',
  })
  eventUrl?: string;

  @Field(() => Boolean, {
    nullable: false,
    defaultValue: false,
    description: 'False if event is available.',
  })
  isArchived: boolean;

  @Field(() => [EventRsvp], { description: 'List of RSVPs for the event.' })
  eventRsvp: EventRsvp[];
}
