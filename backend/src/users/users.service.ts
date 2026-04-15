import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });
  }

  async update(id: string, data: { name?: string; phone?: string }) {
    return this.prisma.user.update({ where: { id }, data, select: { id: true, name: true, email: true, phone: true } });
  }
}
