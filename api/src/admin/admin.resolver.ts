import { Resolver, Query, ObjectType, Field, Int } from '@nestjs/graphql';
import { AdminService } from './admin.service';

@ObjectType()
class AdminStats {
  @Field(() => Int)
  events: number;

  @Field(() => Int)
  communities: number;

  @Field(() => Int)
  bookings: number;

  @Field(() => Int)
  users: number;
}

@ObjectType()
class AdminEvent {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  eventDate: Date;

  @Field({ nullable: true })
  eventLength?: string;

  @Field(() => Int)
  ticketsNumber: number;

  @Field(() => Int)
  price: number;

  @Field({ nullable: true })
  location?: string;

  @Field()
  isArchived: boolean;
}

@ObjectType()
class AdminUser {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  phone: string;

  @Field({ nullable: true })
  birthDate?: Date;

  @Field({ nullable: true })
  createdAt?: Date;
}

@ObjectType()
class AdminBooking {
  @Field()
  id: string;

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

  @Field(() => AdminUser, { nullable: true })
  user?: AdminUser;
}

@Resolver()
export class AdminResolver {
  constructor(private adminService: AdminService) {}

  @Query(() => AdminStats, { name: 'adminStats' })
  async getAdminStats() {
    return this.adminService.getDashboardStats();
  }

  @Query(() => [AdminEvent], { name: 'adminEvents' })
  async getAdminEvents() {
    return this.adminService.getEvents();
  }

  @Query(() => [AdminBooking], { name: 'adminBookings' })
  async getAdminBookings() {
    return this.adminService.getBookings();
  }

  @Query(() => [AdminUser], { name: 'adminUsers' })
  async getAdminUsers() {
    return this.adminService.getUsers();
  }
}