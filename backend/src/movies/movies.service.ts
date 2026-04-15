import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto, UpdateMovieDto } from './dto/movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async findAll(active?: boolean) {
    return this.prisma.movie.findMany({
      where: active !== undefined ? { isActive: active } : {},
      include: { genres: true, sessions: { where: { isActive: true }, take: 1 } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        genres: true,
        sessions: {
          where: { isActive: true, startTime: { gte: new Date() } },
          include: { hall: true },
          orderBy: { startTime: 'asc' },
        },
      },
    });
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async create(dto: CreateMovieDto) {
    const { genres, ...data } = dto;
    return this.prisma.movie.create({
      data: {
        ...data,
        genres: genres?.length
          ? {
              connectOrCreate: genres.map((g) => ({
                where: { name: g },
                create: { name: g },
              })),
            }
          : undefined,
      },
      include: { genres: true },
    });
  }

  async update(id: string, dto: UpdateMovieDto) {
    const { genres, ...data } = dto;
    return this.prisma.movie.update({
      where: { id },
      data: {
        ...data,
        genres: genres
          ? {
              set: [],
              connectOrCreate: genres.map((g) => ({
                where: { name: g },
                create: { name: g },
              })),
            }
          : undefined,
      },
      include: { genres: true },
    });
  }

  async remove(id: string) {
    return this.prisma.movie.update({ where: { id }, data: { isActive: false } });
  }
}
