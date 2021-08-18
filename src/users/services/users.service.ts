import {
  NotFoundException,
  BadRequestException,
  NotAcceptableException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

// import { User } from '../interfaces/user-role.enum';
// import { validateInput, validateLogin } from '../model/user.model';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './../dto/create-user.dto';
import { LoginUserDto } from './../dto/login-user.dto';
import { UpdateUserDto } from './../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../repositories/users.repository';
import { User } from './../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class UsersService {
  logger = new Logger('UsersService');

  constructor(
    // @InjectModel('User') private readonly userModel: Model<User>,
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  addUser(createUserDto: CreateUserDto): Promise<Object> {
    return this.usersRepository.addUser(createUserDto);
  }

  async getUsers(skip: number, limit: number): Promise<Object> {
    return this.usersRepository.getUsers(skip, limit);
  }

  getSingleUser(userId: string): Promise<Object> {
    return this.usersRepository.getSingleUser(userId);
  }

  updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<Object> {
    return this.usersRepository.updateUser(userId, updateUserDto);
  }

  deleteUser(userId: string): Promise<string> {
    return this.usersRepository.deleteUser(userId);
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    try {
      const { email, password } = loginUserDto;

      // const { error } = validateLogin(user);
      // if (error) throw new NotAcceptableException(error.message);

      const validUser = await this.usersRepository.findOne({ email });
      if (!validUser) {
        throw new UnauthorizedException('Invalid email or password!!');
      }

      const validPassword = await bcrypt.compare(password, validUser.password);
      if (!validPassword) {
        throw new UnauthorizedException('Invalid email or password!!');
      }

      const payLoad: JwtPayload = { id: validUser.id, role: validUser.role };
      const accessToken = await this.jwtService.sign(payLoad);

      this.logger.verbose(`Logged in successfully! Token: ${accessToken}`);

      return { accessToken };
    } catch (err) {
      this.logger.error('User is not valid!', err.stack);
      throw err;
    }
  }
}
