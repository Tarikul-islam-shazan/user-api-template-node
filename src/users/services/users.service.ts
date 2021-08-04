import { NotFoundException, NotAcceptableException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from '../model/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async addUser(first: string, last: string, email: string, password: string) {
    try {
      const ifUserExist = await this.userModel.findOne({
        email,
      });

      if (ifUserExist) {
        throw new NotAcceptableException();
      }

      const newUser = new this.userModel({
        firstName: first,
        lastName: last,
        email,
        password,
      });

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
      throw new NotAcceptableException({
        statusCode: 400,
        message: 'The user already exists!',
        error: 'Not Acceptable',
      });
    }
  }

  async getUsers(skip: number, limit: number) {
    try {
      skip = skip ? skip : 0;
      limit = limit ? limit : 2;

      console.log(typeof skip);
      console.log(typeof limit);

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
        throw new NotFoundException();
      }

      return user;
    } catch (err) {
      throw new NotFoundException('User is not found!');
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
        throw new NotFoundException();
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
      throw new NotFoundException('User is not found!');
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
}
