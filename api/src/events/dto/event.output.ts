import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { Event } from '../entities/event.entity';

@ObjectType()
export class EventOutput extends OmitType(Event, ['eventRsvp']) {
  @Field(() => Boolean, {
    description: 'True if user had already registered to the event',
  })
  hasRegistered: boolean;

  @Field(() => Int, { description: 'Number of tickets left' })
  ticketsLeft: number;
}
