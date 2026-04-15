import { Controller, Get, Put, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() { return this.users.findAll(); }

  @Get('profile')
  profile(@Request() req) { return this.users.findOne(req.user.id); }

  @Put('profile')
  update(@Request() req, @Body() body: { name?: string; phone?: string }) {
    return this.users.update(req.user.id, body);
  }
}
