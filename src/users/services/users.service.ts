import {
  NotFoundException,
  BadRequestException,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from '../interfaces/user.interface';
import { validateInput, validateLogin } from '../model/user.model';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './../dto/create-user.dto';
import { LoginUserDto } from './../dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async addUser(createUserDto: CreateUserDto) {
    try {
      const { firstName, lastName, email, password, role } = createUserDto;

      const newUser = new this.userModel({
        firstName,
        lastName,
        email,
        password,
        role,
      });

      const { error } = validateInput(newUser);
      if (error) throw new NotAcceptableException(error.message);

      const ifUserExist = await this.userModel.findOne({
        email: newUser.email,
      });

      if (ifUserExist) {
        throw new BadRequestException('The User already exists!');
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newUser.password, salt);

      newUser.password = hashedPassword;

      const user = await newUser.save();

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
    } catch (err) {
      throw err;
    }
  }

  async getUsers(skip: number, limit: number) {
    try {
      skip = skip ? skip : 0;
      limit = limit ? limit : 2;

      // console.log(typeof skip);
      // console.log(typeof limit);

      const users = await this.userModel.find().skip(skip).limit(limit);

      return users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }));
    } catch (err) {
      throw err;
    }
  }

  async getSingleUser(id: string) {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException('User is not found!');
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  async updateUser(
    id: string,
    first: string,
    last: string,
    email: string,
    password: string,
  ) {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException('User is not found!');
      }

      const updatedUser = user;
      if (first) {
        updatedUser.firstName = first;
      }
      if (last) {
        updatedUser.lastName = last;
      }
      if (email) {
        updatedUser.email = email;
      }
      if (password) {
        updatedUser.password = password;
      }
      updatedUser.save();

      return updatedUser;
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.userModel.findById(id);
      const result = await this.userModel.deleteOne({ _id: id });

      if (result.n === 0) {
        throw new NotFoundException('The user does not exist!');
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  async logging(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;

      const user = new this.userModel({
        email,
        password,
      });

      const { error } = validateLogin(user);
      if (error) throw new NotAcceptableException(error.message);

      const validUser = await this.userModel.findOne({ email: user.email });
      if (!validUser) {
        throw new UnauthorizedException('Invalid email or password!!');
      }

      const validPassword = await bcrypt.compare(
        user.password,
        validUser.password,
      );
      if (!validPassword) {
        throw new UnauthorizedException('Invalid email or password!!');
      }

      const payLoad = { id: user._id, role: validUser.role };
      const accessToken = await this.jwtService.sign(payLoad);

      return { accessToken };
    } catch (err) {
      throw err;
    }
  }
}
