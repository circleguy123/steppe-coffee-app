import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  // ==================== COMMUNITIES ====================

  async createCommunity(userId: string, data: { name: string; description?: string; imageUrl?: string; isPublic?: boolean }) {
    const community = await this.prisma.community.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        isPublic: data.isPublic ?? true,
        createdById: userId,
        members: {
          create: {
            userId: userId,
            role: 'admin',
          },
        },
      },
      include: {
        members: { include: { user: true } },
        createdBy: true,
      },
    });
    return community;
  }

  async getCommunities(userId?: string) {
    return this.prisma.community.findMany({
      where: {
        OR: [
          { isPublic: true },
          { members: { some: { userId } } },
        ],
      },
      include: {
        members: { include: { user: true } },
        createdBy: true,
        _count: { select: { members: true, events: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCommunity(id: string) {
    return this.prisma.community.findUnique({
      where: { id },
      include: {
        members: { include: { user: true } },
        createdBy: true,
        events: { orderBy: { eventDate: 'asc' } },
        _count: { select: { members: true, events: true } },
      },
    });
  }

  async getMyCommunities(userId: string) {
    return this.prisma.community.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        members: { include: { user: true } },
        createdBy: true,
        _count: { select: { members: true, events: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async joinCommunity(userId: string, communityId: string) {
    const existing = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId } },
    });
    if (existing) return existing;

    return this.prisma.communityMember.create({
      data: {
        userId,
        communityId,
        role: 'member',
      },
      include: { community: true, user: true },
    });
  }

  async leaveCommunity(userId: string, communityId: string) {
    return this.prisma.communityMember.delete({
      where: { communityId_userId: { communityId, userId } },
    });
  }

  async updateCommunity(id: string, data: { name?: string; description?: string; imageUrl?: string; isPublic?: boolean }) {
    return this.prisma.community.update({
      where: { id },
      data,
      include: {
        members: { include: { user: true } },
        createdBy: true,
      },
    });
  }

  async deleteCommunity(id: string) {
    return this.prisma.community.delete({ where: { id } });
  }

  // ==================== COMMUNITY EVENTS ====================

  async createCommunityEvent(data: {
    communityId?: string;
    title: string;
    description?: string;
    imageUrl?: string;
    eventDate: Date;
    eventLength?: string;
    location?: string;
    maxAttendees?: number;
    price?: number;
  }) {
    return this.prisma.communityEvent.create({
      data,
      include: {
        community: true,
        _count: { select: { bookings: true } },
      },
    });
  }

  async getCommunityEvents(communityId?: string) {
    return this.prisma.communityEvent.findMany({
      where: communityId ? { communityId } : {},
      include: {
        community: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { eventDate: 'asc' },
    });
  }

  async getCommunityEvent(id: string) {
    return this.prisma.communityEvent.findUnique({
      where: { id },
      include: {
        community: true,
        bookings: { include: { user: true } },
        _count: { select: { bookings: true } },
      },
    });
  }

  // ==================== TABLE BOOKINGS ====================

  async createTableBooking(userId: string, data: {
    eventId?: string;
    tableNumber?: string;
    date: Date;
    timeSlot?: string;
    partySize?: number;
    notes?: string;
  }) {
    return this.prisma.tableBooking.create({
      data: {
        userId,
        ...data,
        status: 'pending',
      },
      include: {
        user: true,
        event: true,
      },
    });
  }

  async getMyBookings(userId: string) {
    return this.prisma.tableBooking.findMany({
      where: { userId },
      include: {
        event: { include: { community: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getEventBookings(eventId: string) {
    return this.prisma.tableBooking.findMany({
      where: { eventId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateBookingStatus(id: string, status: string) {
    return this.prisma.tableBooking.update({
      where: { id },
      data: { status },
      include: { user: true, event: true },
    });
  }

  async cancelBooking(id: string) {
    return this.prisma.tableBooking.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }
}
