/* eslint-disable @typescript-eslint/ban-types */
import {
  UnauthorizedException,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './../dto/create-user.dto';
import { LoginUserDto } from './../dto/login-user.dto';
import { UpdateUserDto } from './../dto/update-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import { User } from './../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class UsersService {
  logger = new Logger('UsersService');

  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  createUser(createUserDto: CreateUserDto): Promise<Object> {
    return this.usersRepository.createUser(createUserDto);
  }

  async createFacebookUser(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken }> {
    const fbUser = await this.usersRepository.createFacebookUser(createUserDto);
    const { email, id, role } = fbUser;

    const isEmailValid = await this.usersRepository.findOne({ email });
    if (!isEmailValid) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const payLoad: JwtPayload = {
      id: id,
      role: role,
    };
    const accessToken = await this.jwtService.sign(payLoad);

    this.logger.verbose(
      `"L:84", "src/users/services/users.service.ts", Logged in successfully! Token: ${JSON.stringify(
        accessToken,
      )}`,
    );

    return { accessToken };
  }

  async getUsers(
    skip: number,
    limit: number,
    requestingUser: User,
  ): Promise<Object | string> {
    return this.usersRepository.getUsers(skip, limit, requestingUser);
  }

  getSingleUser(userId: string, requestingUser: User): Promise<Object> {
    return this.usersRepository.getSingleUser(userId, requestingUser);
  }

  updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
    requestingUser: User,
  ): Promise<Object> {
    return this.usersRepository.updateUser(
      userId,
      updateUserDto,
      requestingUser,
    );
  }

  deleteUser(userId: string, requestingUser: User): Promise<string> {
    return this.usersRepository.deleteUser(userId, requestingUser);
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    try {
      const { email, password } = loginUserDto;

      const isEmailValid = await this.usersRepository.findOne({ email });
      if (!isEmailValid) {
        throw new UnauthorizedException('Invalid email or password!');
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        isEmailValid.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password!');
      }

      const payLoad: JwtPayload = {
        id: isEmailValid.id,
        role: isEmailValid.role,
      };
      const accessToken = await this.jwtService.sign(payLoad);

      this.logger.verbose(
        `"L:84", "src/users/services/users.service.ts", Logged in successfully! Token: ${JSON.stringify(
          accessToken,
        )}`,
      );

      return { accessToken };
    } catch (err) {
      this.logger.error(
        `"L:92", "src/users/services/users.service.ts", User is not valid!`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  dashboard(userInfo: User) {
    try {
      if (!userInfo) {
        throw new NotFoundException('User data is not found!');
      }

      const currentUser = {
        id: userInfo.id,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        role: userInfo.role,
      };

      this.logger.verbose(
        `"L:114", "src/users/services/users.service.ts", Dashboard data loaded. Data: ${JSON.stringify(
          currentUser,
        )}`,
      );

      return currentUser;
    } catch (err) {
      this.logger.error(
        `"L:122", "src/users/services/users.service.ts", User data could not be loaded!`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
