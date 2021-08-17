import {
  IsNotEmpty,
  IsString,
  Min,
  IsEmail,
  Length,
  IsLowercase,
  IsEnum,
  Matches,
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

  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak!',
  })
  password: string;

  @IsString()
  @IsEnum(RoleBase)
  @IsNotEmpty()
  role: RoleBase;
}
