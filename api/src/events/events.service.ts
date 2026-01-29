import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from './entities/event.entity';
import { EventOutput } from './dto/event.output';
import { CreateEventRsvpInput } from './dto/create-event-rsvp.input';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEventInput: CreateEventInput) {
    return 'This action adds a new event';
  }

  async getAllEventsWithRsvps(sessionUserId: string): Promise<EventOutput[]> {
    const events = await this.prisma.event.findMany({
      where: {
        isArchived: false,
      },
      include: {
        eventRsvp: true,
      },
    });
    return events.map(({ eventRsvp, ...eventData }) => {
      return {
        ...eventData,
        hasRegistered:
          eventRsvp.find(({ userId }) => sessionUserId === userId) !== undefined,
        ticketsLeft: eventData.ticketsNumber - eventRsvp.length,
      };
    }) as EventOutput[];
  }

  async getEventById(id: string, sessionUserId: string): Promise<EventOutput> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        eventRsvp: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return {
      ...event,
      hasRegistered: event.eventRsvp.some(rsvp => rsvp.userId === sessionUserId),
      ticketsLeft: event.ticketsNumber - event.eventRsvp.length,
    };
  }

  async createRsvp(userId, input: CreateEventRsvpInput): Promise<EventOutput> {
    const { eventId } = input;

    // Check if the event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Check if the RSVP already exists
    const existingRsvp = await this.prisma.eventRsvp.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });
    if (existingRsvp) {
      throw new BadRequestException('You have already RSVPd to this event');
    }

    // Ensure there are tickets available
    const currentRsvpCount = await this.prisma.eventRsvp.count({
      where: { eventId },
    });
    if (currentRsvpCount >= event.ticketsNumber) {
      throw new BadRequestException('No more tickets available for this event');
    }

    // Create the RSVP
    const eventRsvp = await this.prisma.eventRsvp.create({
      data: {
        userId,
        eventId,
      },
      include: {
        event: {
          include: {
            eventRsvp: true,
          },
        },
      },
    });

    return {
      ...eventRsvp.event,
      hasRegistered: true,
      ticketsLeft:
        eventRsvp.event.ticketsNumber - eventRsvp.event.eventRsvp.length,
    };
  }
}