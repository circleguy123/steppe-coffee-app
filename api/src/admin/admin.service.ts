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

  // Events
  async getEvents() {
    return this.prisma.event.findMany({
      orderBy: { eventDate: 'desc' },
    });
  }
  async getOrders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const orders = await this.prisma.userOrder.findMany({
      where: {
        createdAt: { gte: today },
      },
      include: {
        user: true,
        userOrderItem: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      iikoStatus: order.iikoStatus,
      paymentStatus: order.paymentStatus,
      type: order.type,
      createdAt: order.createdAt,
      user: order.user ? {
        id: order.user.id,
        name: order.user.name,
        phone: order.user.phone,
        role: order.user.role,
      } : null,
      items: order.userOrderItem.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        amount: item.amount,
        price: item.price,
      })),
    }));
  }
  
  async createEvent(data: {
    title: string;
    description?: string;
    eventDate: Date;
    eventLength?: string;
    ticketsNumber: number;
    price: number;
    location?: string;
  }) {
    return this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        eventDate: data.eventDate,
        eventLength: data.eventLength,
        ticketsNumber: data.ticketsNumber,
        price: data.price,
        location: data.location,
        isArchived: false,
      },
    });
  }

  async updateEvent(id: string, data: {
    title: string;
    description?: string;
    eventDate: Date;
    eventLength?: string;
    ticketsNumber: number;
    price: number;
    location?: string;
  }) {
    return this.prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        eventDate: data.eventDate,
        eventLength: data.eventLength,
        ticketsNumber: data.ticketsNumber,
        price: data.price,
        location: data.location,
      },
    });
  }

  async archiveEvent(id: string, isArchived: boolean) {
    return this.prisma.event.update({
      where: { id },
      data: { isArchived },
    });
  }

  async deleteEvent(id: string) {
    await this.prisma.event.delete({ where: { id } });
    return true;
  }

  // Communities
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

  // Bookings
  async getBookings() {
    return this.prisma.tableBooking.findMany({
      include: {
        user: true,
        event: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Users
  async getUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Baristas
  async getBaristas() {
    return this.prisma.user.findMany({
      where: { role: 'barista' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createBarista(phone: string, name: string, password: string) {
    console.log('createBarista called with:', { phone, name, password: password ? '***' : 'EMPTY' });
    
    if (!password) {
      throw new Error('Password is required');
    }
    
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

  // Dashboard stats
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

  async updateAnnouncement(id: string, data: { title?: string; message?: string; type?: string; imageUrl?: string; isActive?: boolean; expiresAt?: Date }) {
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