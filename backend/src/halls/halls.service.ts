import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IRAM_HALL_LAYOUT } from './hall-config';

@Injectable()
export class HallsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.hall.findMany({ include: { _count: { select: { seats: true } } } });
  }

  async findOne(id: string) {
    return this.prisma.hall.findUnique({ where: { id }, include: { seats: true } });
  }

  async create(name: string) {
    const hall = await this.prisma.hall.create({ data: { name, rows: 8 } });
    // seed seats from layout
    for (const row of IRAM_HALL_LAYOUT) {
      for (const num of row.seats) {
        await this.prisma.seat.create({
          data: { hallId: hall.id, row: row.row, number: num },
        });
      }
    }
    return hall;
  }

  async getSeatsWithStatus(hallId: string, sessionId: string) {
    const seats = await this.prisma.seat.findMany({ where: { hallId } });
    const bookedTickets = await this.prisma.ticket.findMany({
      where: { sessionId, status: { in: ['BOOKED', 'RESERVED'] } },
      select: { seatId: true, status: true },
    });
    const statusMap = new Map(bookedTickets.map((t) => [t.seatId, t.status]));
    return seats.map((s) => ({
      ...s,
      status: statusMap.get(s.id) || 'AVAILABLE',
    }));
  }
}
