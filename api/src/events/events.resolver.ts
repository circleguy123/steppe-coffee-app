import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt.payload';
import { EventOutput } from './dto/event.output';
import { CreateEventRsvpInput } from './dto/create-event-rsvp.input';

@UseGuards(AuthGuard)
@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  // @Mutation(() => Event)
  // createEvent(@Args('createEventInput') createEventInput: CreateEventInput) {
  //   return this.eventsService.create(createEventInput);
  // }

  @Query(() => [EventOutput], {
    name: 'events',
    description: 'Fetch all events with their RSVPs.',
  })
  async getAllEventsWithRsvps(
    @Context('req') req: { user: JwtPayload },
  ): Promise<EventOutput[]> {
    return this.eventsService.getAllEventsWithRsvps(req.user.id);
  }

  @Query(() => [EventOutput], {
    name: 'events',
    description: 'Fetch all events with their RSVPs.',
  })
  async eventRsvp(
    @Context('req') req: { user: JwtPayload },
  ): Promise<EventOutput[]> {
    return this.eventsService.getAllEventsWithRsvps(req.user.id);
  }

  @Mutation(() => EventOutput, {
    name: 'rsvpToEvent',
    description: 'RSVP to an event',
  })
  async rsvpToEvent(
    @Args('createEventRsvpInput') createEventRsvpInput: CreateEventRsvpInput,
    @Context('req') req: { user: JwtPayload },
  ): Promise<EventOutput> {
    return this.eventsService.createRsvp(req.user.id, createEventRsvpInput);
  }

  // @Query(() => Event, { name: 'event' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.eventsService.findOne(id);
  // }

  // @Mutation(() => Event)
  // updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
  //   return this.eventsService.update(updateEventInput.id, updateEventInput);
  // }

  // @Mutation(() => Event)
  // removeEvent(@Args('id', { type: () => Int }) id: number) {
  //   return this.eventsService.remove(id);
  // }
}
