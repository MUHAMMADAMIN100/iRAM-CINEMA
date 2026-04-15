import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/session.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(movieId?: string) {
    return this.prisma.session.findMany({
      where: {
        ...(movieId ? { movieId } : {}),
        isActive: true,
        startTime: { gte: new Date() },
      },
      include: { movie: true, hall: true, _count: { select: { tickets: true } } },
      orderBy: { startTime: 'asc' },
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: { movie: true, hall: { include: { seats: true } } },
    });
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async create(dto: CreateSessionDto) {
    const movie = await this.prisma.movie.findUnique({ where: { id: dto.movieId } });
    if (!movie) throw new NotFoundException('Movie not found');
    const startTime = new Date(dto.startTime);
    const endTime = new Date(startTime.getTime() + movie.duration * 60000);
    return this.prisma.session.create({
      data: { movieId: dto.movieId, hallId: dto.hallId, startTime, endTime, price: dto.price },
      include: { movie: true, hall: true },
    });
  }

  async remove(id: string) {
    return this.prisma.session.update({ where: { id }, data: { isActive: false } });
  }

  async getStats() {
    const total = await this.prisma.session.count();
    const today = await this.prisma.session.count({
      where: { startTime: { gte: new Date(new Date().setHours(0,0,0,0)) } },
    });
    return { total, today };
  }
}
