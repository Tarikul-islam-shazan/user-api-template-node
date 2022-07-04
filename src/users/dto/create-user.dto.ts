import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
  IsEnum,
  Matches,
} from 'class-validator';
import { RoleBase } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 50)
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 50)
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @Length(5, 255)
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak!',
  })
  password?: string;

  @ApiProperty()
  @IsString()
  @IsEnum(RoleBase)
  @IsNotEmpty()
  role: RoleBase;
}
