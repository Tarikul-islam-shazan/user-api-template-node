/* eslint-disable @typescript-eslint/ban-types */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';

import { GetUser } from '../decorators/get-user.decorator';
import { ProfileUserDto } from '../dto/profile-user.dto';
import { User } from '../entities/user.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { UsersService } from '../services/users.service';
import { editFileName, imageFileFilter } from '../utils/file-upload.utils';
import { CreateUserDto } from './../dto/create-user.dto';
import { LoginUserDto } from './../dto/login-user.dto';
import { UpdateUserDto } from './../dto/update-user.dto';
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { Roles } from '../decorators/roles.decorator';
import { RoleBase } from '../enums/user-role.enum';
import { RolesGuard } from '../guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  getUsers(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
    @GetUser() requestingUser: User,
  ): Promise<Object | string> {
    return this.usersService.getUsers(skip, limit, requestingUser);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  getSingleUser(
    @Param('id') userId: string,
    @GetUser() requestingUser: User,
  ): Promise<Object> {
    return this.usersService.getSingleUser(userId, requestingUser);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() requestingUser: User,
  ): Promise<Object> {
    return this.usersService.updateUser(userId, updateUserDto, requestingUser);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  deleteUser(
    @Param('id') userId: string,
    @GetUser() requestingUser: User,
  ): Promise<string> {
    return this.usersService.deleteUser(userId, requestingUser);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    return this.usersService.login(loginUserDto);
  }

  @Post('dashboard')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  currentUser(@GetUser() userInfo: User) {
    return this.usersService.dashboard(userInfo);
  }

  @Post('acl-test')
  @ApiBearerAuth()
  @Roles(RoleBase.admin)
  @UseGuards(JwtGuard,RolesGuard)
  aclTest(@Body() cre) {
    return 'acl okay';
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

  @Get('profile/:id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async seeUploadedFile(@Param('id') userId: string, @Res() res) {
    const profileImage = await this.usersService.getUserProfileImage(userId);
    return res.sendFile(profileImage, { root: './files/avatar' });
  }
  
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordObj: ForgotPasswordDto){
    return this.usersService.forgotPassword(forgotPasswordObj);
  }

  @Get('reset-password/:id/:token')
  resetPasswordForGet(
    @Param('id') userId: string,
    @Param('token') token: string){
    
    return this.usersService.resetPasswordGetRequest(userId,token);
  }

  @Post('reset-password/:id/:token')
  resetPassword(
    @Param('id') userId: string,
    @Param('token') token: string,
    @Body() resetPasswordObj: ResetPasswordDto){
    return this.usersService.resetPassword(userId,token,resetPasswordObj);
  }

}
