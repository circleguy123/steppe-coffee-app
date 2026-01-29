import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Community {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  isPublic: boolean;

  @Field()
  createdById: string;

  @Field(() => User)
  createdBy: User;

  @Field(() => [CommunityMember], { nullable: true })
  members?: CommunityMember[];

  @Field(() => Int, { nullable: true })
  memberCount?: number;

  @Field(() => Int, { nullable: true })
  eventCount?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class CommunityMember {
  @Field()
  id: string;

  @Field()
  communityId: string;

  @Field()
  userId: string;

  @Field()
  role: string;

  @Field(() => User)
  user: User;

  @Field(() => Community, { nullable: true })
  community?: Community;

  @Field()
  joinedAt: Date;
}

@ObjectType()
export class CommunityEvent {
  @Field()
  id: string;

  @Field({ nullable: true })
  communityId?: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  eventDate: Date;

  @Field({ nullable: true })
  eventLength?: string;

  @Field({ nullable: true })
  location?: string;

  @Field(() => Int, { nullable: true })
  maxAttendees?: number;

  @Field(() => Int)
  price: number;

  @Field(() => Community, { nullable: true })
  community?: Community;

  @Field(() => Int, { nullable: true })
  bookingCount?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class TableBooking {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  eventId?: string;

  @Field({ nullable: true })
  tableNumber?: string;

  @Field()
  date: Date;

  @Field({ nullable: true })
  timeSlot?: string;

  @Field(() => Int)
  partySize: number;

  @Field()
  status: string;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => User)
  user: User;

  @Field(() => CommunityEvent, { nullable: true })
  event?: CommunityEvent;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
