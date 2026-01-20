import { ObjectType, Field } from '@nestjs/graphql';
import { User as PrismaUser } from '@prisma/client';
import { EventRsvp } from 'src/events/entities/event-rsvp.entity';
import { EpayUserCard } from './epay-user-card.entity';

@ObjectType()
export class User {
  @Field({ description: 'ID' })
  id: string;

  @Field({ description: 'Phone Number' })
  phone: string;

  @Field({ description: 'Name' })
  name: string;

  @Field({ description: 'Surname', nullable: true })
  surName: string;

  @Field({ description: 'Birth Date', nullable: true })
  birthDate: Date;

  @Field(() => [EventRsvp], { description: 'List of RSVPs made by the user.' })
  eventRsvps: EventRsvp[];

  @Field(() => [EpayUserCard], { description: 'List of Epay user cards' })
  paymentCards: EpayUserCard[];

  constructor(user: Partial<PrismaUser>) {
    this.id = user.id;
    this.phone = user.phone;
    this.name = user.name;
    this.birthDate = user.birthDate;
  }
}
