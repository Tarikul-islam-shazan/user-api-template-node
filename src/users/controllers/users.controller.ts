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
} from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body('firstName') first: string,
    @Body('lastName') last: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      const user = await this.usersService.addUser(
        first,
        last,
        email,
        password,
      );

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
    @Body('firstName') first: string,
    @Body('lastName') last: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      const updateUser = await this.usersService.updateUser(
        userId,
        first,
        last,
        email,
        password,
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
}
