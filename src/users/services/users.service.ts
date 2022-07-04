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
import { ResetPasswordDto } from './../dto/reset-password.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { sendMail } from "../../utils/mail.handler";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  logger = new Logger('UsersService');

  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService
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
        `"login", "src/users/services/users.service.ts", Logged in successfully! Token: ${JSON.stringify(
          accessToken,
        )}`,
      );

      return { accessToken };
    } catch (err) {
      this.logger.error(
        `"login", "src/users/services/users.service.ts", User is not valid!`,
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
        `"dashboard", "src/users/services/users.service.ts", Dashboard data loaded. Data: ${JSON.stringify(
          currentUser,
        )}`,
      );

      return currentUser;
    } catch (err) {
      this.logger.error(
        `"dashboard", "src/users/services/users.service.ts", User data could not be loaded!`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async forgotPassword(forgotPasswordObj: ForgotPasswordDto) {
    try {
      const responseMessage = {
        message: 'Email send to your registed email'
      }

      const { email } = forgotPasswordObj;

      const isEmailValid = await this.usersRepository.findOne({ email });
      if (!isEmailValid) {
        return responseMessage;
      }

      const secret = this.configService.get('JWT_SECRET') + isEmailValid.password

      const payLoad = {
        email: isEmailValid.email,
        id: isEmailValid.id
      };

      const token = this.jwtService.sign(payLoad, { secret, expiresIn: this.configService.get('JWT_EXPIRES_FOR_EMAIL')});

      const link = `${this.configService.get('APP_HOSTNAME')}:${this.configService.get('APP_PORT')}/users/reset-password/${isEmailValid.id}/${token}`;

      await sendMail({
        toMail: isEmailValid.email,
        subject: 'Reset password',
        htmlBody: link,
      });

      this.logger.verbose(
        `"forgotPassword", "src/users/services/users.service.ts", Reset password link send ${JSON.stringify(
          link,
        )}`,
      );

      return responseMessage;

    } catch (err) {
      this.logger.error(
        `"forgotPassword", "src/users/services/users.service.ts", User is not valid!`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async resetPasswordGetRequest(userId, token) {
    const response = {
      massage: 'Please enter your password...'
    };

    this.logger.verbose(
      `"resetPasswordGetRequest", "src/users/services/users.service.ts"${JSON.stringify(
        response
      )}`,
    );
    return response;
  }

  async resetPassword(userId, token, resetPassworddObj: ResetPasswordDto) {
    try {
      const { newPassword, conformPassword } = resetPassworddObj;

      if (newPassword !== conformPassword) {
        throw new UnauthorizedException('Password not match!');
      }

      const isValidUser = await this.usersRepository.findOne(userId);
      if (!isValidUser) {
        throw new UnauthorizedException('Invalid email or password!');
      }

      const secret = this.configService.get('JWT_SECRET') + isValidUser.password

      const payLoad = this.jwtService.verify(token, { secret })

      if (!payLoad) {
        throw new UnauthorizedException('not verify');
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      isValidUser.password = hashedPassword;
      this.usersRepository.save(isValidUser);
      
      const response = {
        message: 'Password Reset successfully'
      }

      this.logger.verbose(
        `"resetPassword", "src/users/services/users.service.ts", Reset password successfull ! Token: ${JSON.stringify(
          response,
        )}`,
      );

      return response;

    } catch (err) {
      this.logger.error(
        `"resetPassword", "src/users/services/users.service.ts", Reset password failed !`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
