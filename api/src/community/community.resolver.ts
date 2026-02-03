import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CommunityService } from './community.service';
import { AuthGuard } from '../auth/auth.guard';
import { Community, CommunityMember, CommunityEvent, TableBooking } from './entities/community.entity';
import { Context } from '@nestjs/graphql';
import { JwtPayload } from '../auth/interfaces/jwt.payload';

@Resolver()
export class CommunityResolver {
  constructor(private communityService: CommunityService) {}

  // ==================== COMMUNITIES ====================

  @Query(() => [Community], { name: 'communities' })
  @UseGuards(AuthGuard)
  async communities(@Context('req') req: { user: JwtPayload }) {
    return this.communityService.getCommunities(req.user?.id);
  }

  @Query(() => Community, { name: 'community' })
  @UseGuards(AuthGuard)
  async community(@Args('id') id: string) {
    return this.communityService.getCommunity(id);
  }

  @Query(() => [Community], { name: 'myCommunities' })
  @UseGuards(AuthGuard)
  async myCommunities(@Context('req') req: { user: JwtPayload }) {
    return this.communityService.getMyCommunities(req.user.id);
  }

  @Mutation(() => Community, { name: 'createCommunity' })
  @UseGuards(AuthGuard)
  async createCommunity(
    @Context('req') req: { user: JwtPayload },
    @Args('name') name: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('imageUrl', { nullable: true }) imageUrl?: string,
    @Args('isPublic', { nullable: true }) isPublic?: boolean,
  ) {
    return this.communityService.createCommunity(req.user.id, { name, description, imageUrl, isPublic });
  }

  @Mutation(() => Community, { name: 'updateCommunity' })
  @UseGuards(AuthGuard)
  async updateCommunity(
    @Args('id') id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('imageUrl', { nullable: true }) imageUrl?: string,
    @Args('isPublic', { nullable: true }) isPublic?: boolean,
  ) {
    return this.communityService.updateCommunity(id, { name, description, imageUrl, isPublic });
  }

  @Mutation(() => Community, { name: 'deleteCommunity' })
  @UseGuards(AuthGuard)
  async deleteCommunity(@Args('id') id: string) {
    return this.communityService.deleteCommunity(id);
  }

  @Mutation(() => CommunityMember, { name: 'joinCommunity' })
  @UseGuards(AuthGuard)
  async joinCommunity(
    @Context('req') req: { user: JwtPayload },
    @Args('communityId') communityId: string,
  ) {
    return this.communityService.joinCommunity(req.user.id, communityId);
  }

  @Mutation(() => CommunityMember, { name: 'leaveCommunity' })
  @UseGuards(AuthGuard)
  async leaveCommunity(
    @Context('req') req: { user: JwtPayload },
    @Args('communityId') communityId: string,
  ) {
    return this.communityService.leaveCommunity(req.user.id, communityId);
  }

  // ==================== COMMUNITY EVENTS ====================

  @Query(() => [CommunityEvent], { name: 'communityEvents' })
  @UseGuards(AuthGuard)
  async communityEvents(@Args('communityId', { nullable: true }) communityId?: string) {
    return this.communityService.getCommunityEvents(communityId);
  }

  @Query(() => CommunityEvent, { name: 'communityEvent' })
  @UseGuards(AuthGuard)
  async communityEvent(@Args('id') id: string) {
    return this.communityService.getCommunityEvent(id);
  }

  @Mutation(() => CommunityEvent, { name: 'createCommunityEvent' })
  @UseGuards(AuthGuard)
  async createCommunityEvent(
    @Args('communityId', { nullable: true }) communityId: string,
    @Args('title') title: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('imageUrl', { nullable: true }) imageUrl?: string,
    @Args('eventDate') eventDate?: string,
    @Args('eventLength', { nullable: true }) eventLength?: string,
    @Args('location', { nullable: true }) location?: string,
    @Args('maxAttendees', { type: () => Int, nullable: true }) maxAttendees?: number,
    @Args('price', { type: () => Int, nullable: true }) price?: number,
  ) {
    return this.communityService.createCommunityEvent({
      communityId,
      title,
      description,
      imageUrl,
      eventDate: new Date(eventDate),
      eventLength,
      location,
      maxAttendees,
      price,
    });
  }

  // ==================== TABLE BOOKINGS ====================

  @Query(() => [TableBooking], { name: 'myBookings' })
  @UseGuards(AuthGuard)
  async myBookings(@Context('req') req: { user: JwtPayload }) {
    return this.communityService.getMyBookings(req.user.id);
  }

  @Query(() => [TableBooking], { name: 'communityBookings' })
  @UseGuards(AuthGuard)
  async communityBookings(@Args('communityId') communityId: string) {
    return this.communityService.getCommunityBookings(communityId);
  }

  @Query(() => [TableBooking], { name: 'eventBookings' })
  @UseGuards(AuthGuard)
  async eventBookings(@Args('eventId') eventId: string) {
    return this.communityService.getEventBookings(eventId);
  }

  @Mutation(() => TableBooking, { name: 'createTableBooking' })
  @UseGuards(AuthGuard)
  async createTableBooking(
    @Context('req') req: { user: JwtPayload },
    @Args('eventId', { nullable: true }) eventId?: string,
    @Args('communityId', { nullable: true }) communityId?: string,
    @Args('tableNumber', { nullable: true }) tableNumber?: string,
    @Args('date') date?: string,
    @Args('timeSlot', { nullable: true }) timeSlot?: string,
    @Args('partySize', { type: () => Int, nullable: true }) partySize?: number,
    @Args('notes', { nullable: true }) notes?: string,
  ) {
    return this.communityService.createTableBooking(req.user.id, {
      eventId,
      communityId,
      tableNumber,
      date: new Date(date),
      timeSlot,
      partySize,
      notes,
    });
  }

  @Mutation(() => [TableBooking], { name: 'createCommunityTableBooking' })
  @UseGuards(AuthGuard)
  async createCommunityTableBooking(
    @Context('req') req: { user: JwtPayload },
    @Args('communityId') communityId: string,
    @Args('eventId', { nullable: true }) eventId?: string,
    @Args('tableNumbers', { type: () => [String] }) tableNumbers?: string[],
    @Args('date') date?: string,
    @Args('timeSlot', { nullable: true }) timeSlot?: string,
    @Args('partySize', { type: () => Int, nullable: true }) partySize?: number,
    @Args('notes', { nullable: true }) notes?: string,
  ) {
    return this.communityService.createCommunityTableBooking(req.user.id, {
      communityId,
      eventId,
      tableNumbers,
      date: new Date(date),
      timeSlot,
      partySize,
      notes,
    });
  }

  @Mutation(() => TableBooking, { name: 'updateBookingStatus' })
  @UseGuards(AuthGuard)
  async updateBookingStatus(
    @Args('id') id: string,
    @Args('status') status: string,
  ) {
    return this.communityService.updateBookingStatus(id, status);
  }

  @Mutation(() => TableBooking, { name: 'cancelBooking' })
  @UseGuards(AuthGuard)
  async cancelBooking(@Args('id') id: string) {
    return this.communityService.cancelBooking(id);
  }
}