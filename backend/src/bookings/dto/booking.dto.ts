import { IsString, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty() @IsString() sessionId: string;
  @ApiProperty({ type: [String] }) @IsArray() @ArrayMinSize(1) seatIds: string[];
}
