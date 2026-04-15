import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HallsService } from './halls.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@ApiTags('Halls')
@Controller('halls')
export class HallsController {
  constructor(private halls: HallsService) {}

  @Get()
  findAll() { return this.halls.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.halls.findOne(id); }

  @Get(':id/seats/:sessionId')
  getSeats(@Param('id') id: string, @Param('sessionId') sessionId: string) {
    return this.halls.getSeatsWithStatus(id, sessionId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Post()
  create(@Body('name') name: string) { return this.halls.create(name); }
}
