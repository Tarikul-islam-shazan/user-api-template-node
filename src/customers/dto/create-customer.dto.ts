import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 255)
  @IsString()
  customerId: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 255)
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 255)
  @IsString()
  street: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 255)
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  @Length(5, 255)
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @Length(5, 255)
  @IsNotEmpty()
  zip: string;
}
