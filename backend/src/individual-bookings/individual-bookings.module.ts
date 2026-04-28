import { Module } from '@nestjs/common';
import { IndividualBookingsController } from './individual-bookings.controller';
import { IndividualBookingsService } from './individual-bookings.service';

@Module({
  controllers: [IndividualBookingsController],
  providers: [IndividualBookingsService],
})
export class IndividualBookingsModule {}
