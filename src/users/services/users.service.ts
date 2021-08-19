import { UnauthorizedException, Logger } from '@nestjs/common';
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
        throw new UnauthorizedException('Invalid email or password!!');
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        isEmailValid.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password!!');
      }

      const payLoad: JwtPayload = {
        id: isEmailValid.id,
        role: isEmailValid.role,
      };
      const accessToken = await this.jwtService.sign(payLoad);

      this.logger.verbose(
        `Logged in successfully! Token: ${JSON.stringify(accessToken)}`,
      );

      return { accessToken };
    } catch (err) {
      this.logger.error('User is not valid!', err.stack);
      throw err;
    }
  }
}
