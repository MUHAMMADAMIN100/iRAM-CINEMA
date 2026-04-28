import { IsString, IsOptional, IsEmail, IsDateString, IsInt, Min, Length, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IndividualBookingStatus } from '@prisma/client';

export class CreateIndividualBookingDto {
  @ApiProperty() @IsString() @Length(2, 100) fullName: string;
  @ApiProperty() @IsString() @Length(5, 30) phone: string;
  @ApiProperty({ required: false }) @IsOptional() @IsEmail() email?: string;
  @ApiProperty() @IsString() @Length(1, 200) movieTitle: string;
  @ApiProperty() @IsDateString() preferredAt: string;
  @ApiProperty() @IsInt() @Min(1) guestsCount: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @Length(0, 1000) notes?: string;
}

export class UpdateIndividualBookingStatusDto {
  @ApiProperty({ enum: IndividualBookingStatus })
  @IsEnum(IndividualBookingStatus)
  status: IndividualBookingStatus;
}
