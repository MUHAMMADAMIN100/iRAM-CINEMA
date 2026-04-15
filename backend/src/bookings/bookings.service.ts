import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma, SeatStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/booking.dto';
import * as QRCode from 'qrcode';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    const session = await this.prisma.session.findUnique({
      where: { id: dto.sessionId },
      include: { movie: true },
    });
    if (!session) throw new NotFoundException('Session not found');

    // Check seats are not already taken
    const taken = await this.prisma.ticket.findMany({
      where: {
        sessionId: dto.sessionId,
        seatId: { in: dto.seatIds },
        status: { in: ['BOOKED', 'RESERVED'] },
      },
    });
    if (taken.length > 0) {
      throw new BadRequestException('Some seats are already taken');
    }

    const total = session.price * dto.seatIds.length;

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        sessionId: dto.sessionId,
        total,
        status: 'CONFIRMED',
        tickets: {
          create: await Promise.all(
            dto.seatIds.map(async (seatId): Promise<Prisma.TicketUncheckedCreateWithoutBookingInput> => {
              const qrData = JSON.stringify({ bookingId: 'pending', seatId, sessionId: dto.sessionId });
              const qrCode = await QRCode.toDataURL(qrData);
              return { sessionId: dto.sessionId, seatId, status: SeatStatus.BOOKED, qrCode };
            }),
          ),
        },
      },
      include: {
        tickets: { include: { seat: true } },
        session: { include: { movie: true, hall: true } },
      },
    });

    return booking;
  }

  async findUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        tickets: { include: { seat: true } },
        session: { include: { movie: true, hall: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        tickets: { include: { seat: true } },
        session: { include: { movie: true, hall: true } },
        user: { select: { name: true, email: true } },
      },
    });
  }

  async cancel(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new BadRequestException('Not your booking');

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        tickets: { updateMany: { where: { bookingId: id }, data: { status: 'AVAILABLE' } } },
      },
    });
  }

  async adminFindAll() {
    return this.prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        session: { include: { movie: true } },
        tickets: { include: { seat: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async getStats() {
    const [totalBookings, totalRevenue, todayBookings] = await Promise.all([
      this.prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      this.prisma.booking.aggregate({ where: { status: 'CONFIRMED' }, _sum: { total: true } }),
      this.prisma.booking.count({
        where: {
          status: 'CONFIRMED',
          createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) },
        },
      }),
    ]);
    return {
      totalBookings,
      totalRevenue: totalRevenue._sum.total || 0,
      todayBookings,
    };
  }
}
