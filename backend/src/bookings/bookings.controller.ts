import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private bookings: BookingsService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateBookingDto) {
    return this.bookings.create(req.user.id, dto);
  }

  @Get('my')
  myBookings(@Request() req) {
    return this.bookings.findUserBookings(req.user.id);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  stats() { return this.bookings.getStats(); }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminAll() { return this.bookings.adminFindAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.bookings.findOne(id); }

  @Delete(':id')
  cancel(@Param('id') id: string, @Request() req) {
    return this.bookings.cancel(id, req.user.id);
  }
}
