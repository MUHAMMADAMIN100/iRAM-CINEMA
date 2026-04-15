import { IsString, IsInt, IsOptional, IsUrl, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() titleRu: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() poster?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() trailer?: string;
  @ApiProperty() @IsInt() @Min(1) duration: number;
  @ApiProperty({ required: false }) @IsOptional() language?: string;
  @ApiProperty({ required: false }) @IsOptional() ageLimit?: string;
  @ApiProperty({ required: false, type: [String] }) @IsOptional() genres?: string[];
}

export class UpdateMovieDto extends CreateMovieDto {}
