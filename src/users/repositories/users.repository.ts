/* eslint-disable @typescript-eslint/ban-types */
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { CreateUserDto } from './../dto/create-user.dto';
import { UpdateUserDto } from './../dto/update-user.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  logger = new Logger('UsersRepository');

  async createUser(createUserDto: CreateUserDto): Promise<Object> {
    try {
      const { firstName, lastName, email, password, role } = createUserDto;

      const newUser = this.create({
        firstName,
        lastName,
        email,
        password,
        role,
      });

      const ifUserExists = await this.findOne({
        email: newUser.email,
      });

      if (ifUserExists) {
        throw new BadRequestException('The User already exists!');
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newUser.password, salt);

      newUser.password = hashedPassword;

      await this.save(newUser);

      const newValidUser = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      };

      this.logger.verbose(
        `"L:54", "src/users/repositories/users.repository.ts", A new user is created! Data: ${JSON.stringify(
          newValidUser,
        )}`,
      );

      return newValidUser;
    } catch (err) {
      this.logger.error(
        `"L:62", "src/users/repositories/users.repository.ts", The User already exists!`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getSingleUser(userId: string, requestingUser: User): Promise<Object> {
    try {
      // console.log(`The requested User is ${JSON.stringify(requestingUser)}`);

      if (requestingUser.role !== 'admin') {
        // console.log(`The requested user role is ${requestingUser.role}`);
        throw new ForbiddenException('The user is not allowed to access!');
      }

      const user = await this.findOne(userId);

      if (!user) {
        throw new NotFoundException('User is not found!');
      }

      const userInfo = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };

      this.logger.verbose(
        `"L:93", "src/users/repositories/users.repository.ts", User is found! Data: ${JSON.stringify(
          userInfo,
        )}`,
      );

      return userInfo;
    } catch (err) {
      this.logger.error(
        `"L:101", "src/users/repositories/users.repository.ts", The user with ID ${JSON.stringify(
          userId,
        )} is not found!`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
    requestingUser: User,
  ): Promise<Object> {
    try {
      // console.log(`The requested User is ${JSON.stringify(requestingUser)}`);

      if (requestingUser.role !== 'admin') {
        // console.log(`The requested user role is ${requestingUser.role}`);
        throw new ForbiddenException('The user is not allowed to access!');
      }

      const user = await this.findOne(userId);
      if (!user) {
        throw new NotFoundException('User is not found!');
      }

      const { firstName, lastName, email, password } = updateUserDto;
      const updatedUser = user;

      if (firstName) {
        updatedUser.firstName = firstName;
      }
      if (lastName) {
        updatedUser.lastName = lastName;
      }
      if (email) {
        updatedUser.email = email;
      }
      if (password) {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(updatedUser.password, salt);

        updatedUser.password = hashedPassword;
      }
      this.save(updatedUser);

      const updatedUserInfo = {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      };

      this.logger.verbose(
        `"L:156", "src/users/repositories/users.repository.ts", The user with ID ${userId} is updated! Data: ${JSON.stringify(
          updatedUserInfo,
        )}`,
      );

      return updatedUserInfo;
    } catch (err) {
      this.logger.error(
        `"L:164", "src/users/repositories/users.repository.ts", The user with ID ${JSON.stringify(
          userId,
        )} is not found!`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async deleteUser(userId: string, requestingUser: User): Promise<string> {
    try {
      // console.log(`The requested User is ${JSON.stringify(requestingUser)}`);

      if (requestingUser.role !== 'admin') {
        // console.log(`The requested user role is ${requestingUser.role}`);
        throw new ForbiddenException('The user is not allowed to access!');
      }

      const result = await this.delete(userId);

      if (result.affected === 0) {
        throw new NotFoundException('The user does not exist!');
      }

      this.logger.log(
        `"L:189", "src/users/repositories/users.repository.ts", The task with ID ${JSON.stringify(
          userId,
        )} is deleted!`,
      );

      return `The task with ID ${userId} is deleted!`;
    } catch (err) {
      this.logger.error(
        `"L:197", "src/users/repositories/users.repository.ts", The user with ID ${JSON.stringify(
          userId,
        )} is not found!`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getUsers(
    skip: number,
    limit: number,
    requestingUser: User,
  ): Promise<Object | string> {
    try {
      skip = skip ? skip : 0;
      limit = limit ? limit : 2;

      // console.log(typeof skip);
      // console.log(typeof limit);

      // console.log(`The requested User is ${JSON.stringify(requestingUser)}`);

      if (requestingUser.role !== 'admin') {
        // console.log(`The requested user role is ${requestingUser.role}`);
        throw new ForbiddenException('The user is not allowed to access!');
      }

      const usersList = await this.find({
        skip: skip,
        take: limit,
      });

      if (usersList.length === 0) {
        this.logger.log(
          `"L:232", "src/users/repositories/users.repository.ts", No data to show!`,
        );
        return 'There are no users to show!';
      }

      this.logger.verbose(
        `"L:238", "src/users/repositories/users.repository.ts", User's list is loaded! Data: ${JSON.stringify(
          usersList,
        )}`,
      );

      return usersList.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }));
    } catch (err) {
      this.logger.error(
        `"L:252", "src/users/repositories/users.repository.ts", Failed to load the users list`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
