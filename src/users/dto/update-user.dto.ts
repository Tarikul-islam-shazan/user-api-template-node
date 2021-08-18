import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Min,
  IsEmail,
  Length,
  IsLowercase,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @Length(2, 50)
  @IsString()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @Length(2, 50)
  @IsString()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEmail()
  @Length(5, 255)
  @IsNotEmpty()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @Length(5, 1024)
  @IsNotEmpty()
  @IsString()
  password?: string;
}
