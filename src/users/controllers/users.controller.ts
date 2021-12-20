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
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../entities/user.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from './../dto/create-user.dto';
import { LoginUserDto } from './../dto/login-user.dto';
import { UpdateUserDto } from './../dto/update-user.dto';

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
}
