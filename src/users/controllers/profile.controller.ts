import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { GetUser } from '../decorators/get-user.decorator';
import { ProfileUserDto } from '../dto/profile-user.dto';
import { User } from '../entities/user.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { UsersService } from '../services/users.service';
import { editFileName, imageFileFilter } from '../utils/file-upload.utils';

@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  getProfile(@Req() req, @GetUser() requestingUser: User) {
    const { id } = req.user;
    return this.usersService.getSingleUser(id, requestingUser);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  updateUserProfileFirstName(
    @Param('id') userId: string,
    @Body() profileUserDto: ProfileUserDto,
  ): Promise<any> {
    return this.usersService.updateUserProfile(userId, profileUserDto);
  }

  @Post('upload')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/avatar',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadFile(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const { id } = req.user;
    const profileUserDto: ProfileUserDto = {};
    if (file) {
      profileUserDto.profileImagePath = file.filename;
      return this.usersService.updateUserProfile(id, profileUserDto);
    } else {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No file found',
      };
    }
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async seeUploadedFile(@Param('id') userId: string, @Res() res) {
    const profileImage = await this.usersService.getUserProfileImage(userId);
    return res.sendFile(profileImage, { root: './files/avatar' });
  }
}
