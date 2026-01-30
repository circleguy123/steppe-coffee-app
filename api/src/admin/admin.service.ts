import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getEvents() {
    return this.prisma.event.findMany({
      orderBy: { eventDate: 'desc' },
    });
  }

  async getCommunities() {
    return this.prisma.community.findMany({
      include: {
        members: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookings() {
    return this.prisma.tableBooking.findMany({
      include: {
        user: true,
        event: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDashboardStats() {
    const [eventsCount, communitiesCount, bookingsCount, usersCount] = await Promise.all([
      this.prisma.event.count(),
      this.prisma.community.count(),
      this.prisma.tableBooking.count(),
      this.prisma.user.count(),
    ]);

    return {
      events: eventsCount,
      communities: communitiesCount,
      bookings: bookingsCount,
      users: usersCount,
    };
  }
}