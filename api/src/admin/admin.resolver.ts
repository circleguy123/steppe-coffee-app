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

  @Field({ nullable: true })
  communityName?: string;
}

@ObjectType()
class AdminOrderItem {
  @Field()
  id: string;

  @Field()
  productId: string;

  @Field({ nullable: true })
  productName?: string;

  @Field(() => Int)
  amount: number;

  @Field()
  price: number;
}

@ObjectType()
class AdminOrder {
  @Field()
  id: string;

  @Field(() => Int)
  orderNumber: number;

  @Field(() => Int)
  total: number;

  @Field()
  iikoStatus: string;

  @Field()
  paymentStatus: string;

  @Field()
  type: string;

  @Field(() => AdminUser, { nullable: true })
  user?: AdminUser;

  @Field(() => [AdminOrderItem])
  items: AdminOrderItem[];

  @Field()
  createdAt: Date;
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

@Resolver()
export class AdminResolver {
  constructor(private adminService: AdminService) {}

  @Query(() => [AdminOrder], { name: 'adminOrders' })
  async getAdminOrders() {
    return this.adminService.getOrders();
  }

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

  @Query(() => [Announcement], { name: 'announcements' })
  async getAnnouncements() {
    return this.adminService.getAnnouncements();
  }

  @Query(() => [Announcement], { name: 'adminAnnouncements' })
  async getAdminAnnouncements() {
    return this.adminService.getAllAnnouncements();
  }

  // Event mutations
  @Mutation(() => AdminEvent, { name: 'createEvent' })
  async createEvent(
    @Args('title') title: string,
    @Args('eventDate') eventDate: Date,
    @Args('ticketsNumber', { type: () => Int }) ticketsNumber: number,
    @Args('price', { type: () => Int }) price: number,
    @Args('description', { nullable: true }) description?: string,
    @Args('eventLength', { nullable: true }) eventLength?: string,
    @Args('location', { nullable: true }) location?: string,
  ) {
    return this.adminService.createEvent({
      title,
      description,
      eventDate,
      eventLength,
      ticketsNumber,
      price,
      location,
    });
  }

  @Mutation(() => AdminEvent, { name: 'updateEvent' })
  async updateEvent(
    @Args('id') id: string,
    @Args('title') title: string,
    @Args('eventDate') eventDate: Date,
    @Args('ticketsNumber', { type: () => Int }) ticketsNumber: number,
    @Args('price', { type: () => Int }) price: number,
    @Args('description', { nullable: true }) description?: string,
    @Args('eventLength', { nullable: true }) eventLength?: string,
    @Args('location', { nullable: true }) location?: string,
  ) {
    return this.adminService.updateEvent(id, {
      title,
      description,
      eventDate,
      eventLength,
      ticketsNumber,
      price,
      location,
    });
  }

  @Mutation(() => AdminEvent, { name: 'archiveEvent' })
  async archiveEvent(
    @Args('id') id: string,
    @Args('isArchived') isArchived: boolean,
  ) {
    return this.adminService.archiveEvent(id, isArchived);
  }

  @Mutation(() => Boolean, { name: 'deleteEvent' })
  async deleteEvent(@Args('id') id: string) {
    return this.adminService.deleteEvent(id);
  }

  // Barista mutations
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

  // Announcement mutations
  @Mutation(() => Announcement, { name: 'createAnnouncement' })
  async createAnnouncement(
    @Args('title') title: string,
    @Args('message') message: string,
    @Args('type', { nullable: true }) type?: string,
    @Args('imageUrl', { nullable: true }) imageUrl?: string,
    @Args('expiresAt', { nullable: true }) expiresAt?: Date,
  ) {
    return this.adminService.createAnnouncement(title, message, type || 'info', expiresAt);
  }

  @Mutation(() => Announcement, { name: 'updateAnnouncement' })
  async updateAnnouncement(
    @Args('id') id: string,
    @Args('title', { nullable: true }) title?: string,
    @Args('message', { nullable: true }) message?: string,
    @Args('type', { nullable: true }) type?: string,
    @Args('imageUrl', { nullable: true }) imageUrl?: string,
    @Args('isActive', { nullable: true }) isActive?: boolean,
    @Args('expiresAt', { nullable: true }) expiresAt?: Date,
  ) {
    return this.adminService.updateAnnouncement(id, { title, message, type, imageUrl, isActive, expiresAt });
  }

  @Mutation(() => Boolean, { name: 'deleteAnnouncement' })
  async deleteAnnouncement(@Args('id') id: string) {
    return this.adminService.deleteAnnouncement(id);
  }
}