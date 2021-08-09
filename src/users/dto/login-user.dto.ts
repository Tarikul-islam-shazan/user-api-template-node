import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @Length(5, 255)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(5, 255)
  @IsNotEmpty()
  password: string;
}
