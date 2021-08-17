import {
  IsNotEmpty,
  IsString,
  Min,
  IsEmail,
  Length,
  IsLowercase,
  IsEnum,
} from 'class-validator';
import { RoleBase } from '../interfaces/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 50)
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @Length(2, 50)
  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  @Length(5, 255)
  @IsNotEmpty()
  email: string;

  @Length(5, 1024)
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  @IsEnum(RoleBase)
  @IsNotEmpty()
  role: RoleBase;
}
