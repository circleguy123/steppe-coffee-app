import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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

  async getBaristas() {
    return this.prisma.user.findMany({
      where: { role: 'barista' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createBarista(phone: string, name: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        phone,
        name,
        password: hashedPassword,
        role: 'barista',
      },
    });
  }

  async deleteBarista(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return true;
  }

  async baristaLogin(phone: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user || user.role !== 'barista') {
      return { success: false, message: 'Invalid credentials' };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { success: false, message: 'Invalid credentials' };
    }

    const token = this.jwtService.sign({ userId: user.id, role: user.role });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    };
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

  // Announcements
  async getAnnouncements() {
    return this.prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllAnnouncements() {
    return this.prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAnnouncement(title: string, message: string, type: string, expiresAt?: Date) {
    return this.prisma.announcement.create({
      data: { title, message, type, expiresAt, isActive: true },
    });
  }

  async updateAnnouncement(id: string, data: { title?: string; message?: string; type?: string; isActive?: boolean; expiresAt?: Date }) {
    return this.prisma.announcement.update({
      where: { id },
      data,
    });
  }

  async deleteAnnouncement(id: string) {
    await this.prisma.announcement.delete({ where: { id } });
    return true;
  }
}