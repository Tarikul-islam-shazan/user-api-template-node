import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';

export class ProfileUserDto {
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
  @IsNotEmpty()
  @Length(5, 255)
  @IsString()
  profileImagePath?: string;
}
