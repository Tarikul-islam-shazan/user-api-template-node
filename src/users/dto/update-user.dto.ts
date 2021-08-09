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
  @IsOptional()
  @IsNotEmpty()
  @Length(2, 50)
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @Length(2, 50)
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @Length(5, 255)
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @Length(5, 1024)
  @IsNotEmpty()
  @IsString()
  password?: string;
}
