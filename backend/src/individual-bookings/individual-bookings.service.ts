import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIndividualBookingDto, UpdateIndividualBookingStatusDto } from './dto/individual-booking.dto';

@Injectable()
export class IndividualBookingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateIndividualBookingDto) {
    const preferredAt = new Date(dto.preferredAt);
    if (isNaN(preferredAt.getTime())) throw new BadRequestException('Invalid date');
    if (preferredAt.getTime() < Date.now()) throw new BadRequestException('Дата должна быть в будущем');

    return this.prisma.individualBooking.create({
      data: {
        fullName: dto.fullName.trim(),
        phone: dto.phone.trim(),
        email: dto.email?.trim() || null,
        movieTitle: dto.movieTitle.trim(),
        preferredAt,
        guestsCount: dto.guestsCount,
        notes: dto.notes?.trim() || null,
      },
    });
  }

  async findAll() {
    return this.prisma.individualBooking.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.individualBooking.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Заявка не найдена');
    return item;
  }

  async updateStatus(id: string, dto: UpdateIndividualBookingStatusDto) {
    await this.findOne(id);
    return this.prisma.individualBooking.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.individualBooking.delete({ where: { id } });
    return { success: true, id };
  }

  async stats() {
    const [total, newCount] = await Promise.all([
      this.prisma.individualBooking.count(),
      this.prisma.individualBooking.count({ where: { status: 'NEW' } }),
    ]);
    return { total, newCount };
  }
}
