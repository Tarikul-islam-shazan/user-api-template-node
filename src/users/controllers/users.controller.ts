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
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.addUser(createUserDto);

      return user;
    } catch (err) {
      throw err;
    }
  }

  @Get()
  async allUsers(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    try {
      const users = await this.usersService.getUsers(skip, limit);

      return users;
    } catch (err) {
      throw err;
    }
  }

  @Get(':id')
  async singleUser(@Param('id') userId: string) {
    try {
      const user = await this.usersService.getSingleUser(userId);
      return user;
    } catch (err) {
      throw err;
    }
  }

  @Patch(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const updateUser = await this.usersService.updateUser(
        userId,
        updateUserDto,
      );

      return updateUser;
    } catch (err) {
      throw err;
    }
  }

  @Delete(':id')
  async userDelete(@Param('id') userId: string) {
    try {
      const user = await this.usersService.deleteUser(userId);
      return { message: 'The user is deleted', id: user.id };
    } catch (err) {
      throw err;
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const user = await this.usersService.logging(loginUserDto);

      return user;
    } catch (err) {
      throw err;
    }
  }

  @Post('dashboard')
  @UseGuards(AuthGuard())
  currentUser(@Req() req) {
    return req.user;
  }
}
