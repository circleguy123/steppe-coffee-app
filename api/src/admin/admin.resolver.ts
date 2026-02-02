import { Resolver, Query, Mutation, Args, ObjectType, Field, Int, InputType } from '@nestjs/graphql';
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

  @Field()
  role: string;
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

@ObjectType()
class BaristaLoginResult {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  message?: string;

  @Field(() => AdminUser, { nullable: true })
  user?: AdminUser;
}

@ObjectType()
class Announcement {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field()
  type: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  linkUrl?: string;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  expiresAt?: Date;

  @Field()
  createdAt: Date;
}

@InputType()
class CreateBaristaInput {
  @Field()
  phone: string;

  @Field()
  name: string;

  @Field()
  password: string;
}

@InputType()
class CreateAnnouncementInput {
  @Field()
  title: string;

  @Field()
  message: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  linkUrl?: string;

  @Field({ nullable: true })
  expiresAt?: Date;
}

@InputType()
class UpdateAnnouncementInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  linkUrl?: string;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field({ nullable: true })
  expiresAt?: Date;
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

  @Query(() => [AdminUser], { name: 'adminBaristas' })
  async getAdminBaristas() {
    return this.adminService.getBaristas();
  }

  // Announcements - public query for app
  @Query(() => [Announcement], { name: 'announcements' })
  async getAnnouncements() {
    return this.adminService.getAnnouncements();
  }

  // Announcements - admin query (includes inactive)
  @Query(() => [Announcement], { name: 'adminAnnouncements' })
  async getAdminAnnouncements() {
    return this.adminService.getAllAnnouncements();
  }

  @Mutation(() => AdminUser, { name: 'createBarista' })
  async createBarista(
    @Args('phone') phone: string,
    @Args('name') name: string,
    @Args('password') password: string,
  ) {
    return this.adminService.createBarista(phone, name, password);
  }

  @Mutation(() => Boolean, { name: 'deleteBarista' })
  async deleteBarista(@Args('id') id: string) {
    return this.adminService.deleteBarista(id);
  }

  @Mutation(() => BaristaLoginResult, { name: 'baristaLogin' })
  async baristaLogin(
    @Args('phone') phone: string,
    @Args('password') password: string,
  ) {
    return this.adminService.baristaLogin(phone, password);
  }

  @Mutation(() => Announcement, { name: 'createAnnouncement' })
  async createAnnouncement(@Args('input') input: CreateAnnouncementInput) {
    return this.adminService.createAnnouncement(
      input.title,
      input.message,
      input.type || 'info',
      input.expiresAt,
    );
  }

  @Mutation(() => Announcement, { name: 'updateAnnouncement' })
  async updateAnnouncement(
    @Args('id') id: string,
    @Args('input') input: UpdateAnnouncementInput,
  ) {
    return this.adminService.updateAnnouncement(id, input);
  }

  @Mutation(() => Boolean, { name: 'deleteAnnouncement' })
  async deleteAnnouncement(@Args('id') id: string) {
    return this.adminService.deleteAnnouncement(id);
  }
}