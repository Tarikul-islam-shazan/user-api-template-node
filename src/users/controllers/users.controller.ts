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
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from '../services/users.service';
import { CreateUserDto } from './../dto/create-user.dto';
import { LoginUserDto } from './../dto/login-user.dto';
import { UpdateUserDto } from './../dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.addUser(createUserDto);
  }

  @Get()
  allUsers(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<Object> {
    return this.usersService.getUsers(skip, limit);
  }

  @Get(':id')
  singleUser(@Param('id') userId: string): Promise<Object> {
    return this.usersService.getSingleUser(userId);
  }

  @Patch(':id')
  updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Object> {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete(':id')
  userDelete(@Param('id') userId: string): Promise<string> {
    return this.usersService.deleteUser(userId);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    return this.usersService.login(loginUserDto);
  }

  // @Post('dashboard')
  // @UseGuards(AuthGuard())
  // currentUser(@Req() req) {
  //   return req.user;
  // }
}
