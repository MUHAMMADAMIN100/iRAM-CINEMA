import { IsString, IsDateString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty() @IsString() movieId: string;
  @ApiProperty() @IsString() hallId: string;
  @ApiProperty() @IsDateString() startTime: string;
  @ApiProperty() @IsNumber() @Min(1) price: number;
}
