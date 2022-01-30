import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Match } from '../decorators/match.decorator';

export class ResetPasswordDto {
    @ApiProperty()
    @IsString()
    @Length(5, 255)
    @IsNotEmpty()
    public newPassword: string;

    @ApiProperty()
    @IsString()
    @Length(5, 255)
    @IsNotEmpty()
    @Match('newPassword')
    public conformPassword: string;
}
