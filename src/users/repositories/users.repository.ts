import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './../dto/create-user.dto';
import { UpdateUserDto } from './../dto/update-user.dto';
import { error } from 'console';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  logger = new Logger('UsersRepository');

  async addUser(createUserDto: CreateUserDto): Promise<Object> {
    try {
      const { firstName, lastName, email, password, role } = createUserDto;

      const newUser = this.create({
        firstName,
        lastName,
        email,
        password,
        role,
      });

      // const { error } = validateInput(newUser);
      // if (error) throw new NotAcceptableException(error.message);

      const ifUserExist = await this.findOne({
        email: newUser.email,
      });

      if (ifUserExist) {
        throw new BadRequestException('The User already exists!');
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newUser.password, salt);

      newUser.password = hashedPassword;

      const user = await this.save(newUser);

      const result = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };

      this.logger.verbose(`A new user is created! Data: ${result}`);

      return result;
    } catch (err) {
      this.logger.error(`The User already exists!`, err.stack);
      throw err;
    }
  }

  async getSingleUser(userId: string): Promise<Object> {
    try {
      const user = await this.findOne(userId);

      if (!user) {
        throw new NotFoundException('User is not found!');
      }

      const result = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };

      this.logger.verbose(`User is found! Data: ${result}`);

      return result;
    } catch (err) {
      this.logger.error(`The user with ID ${userId} is not found!`, err.stack);
      throw err;
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Object> {
    try {
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

      const result = {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      };

      this.logger.verbose(
        `The user with ID ${userId} is updated! Data: ${result}`,
      );

      return result;
    } catch (err) {
      this.logger.error(`The user with ID ${userId} is not found!`, err.stack);
      throw err;
    }
  }

  async deleteUser(userId: string): Promise<string> {
    try {
      const user = await this.findOne(userId);
      const result = await this.delete(userId);

      if (result.affected === 0) {
        throw new NotFoundException('The user does not exist!');
      }

      this.logger.log(`The task with ID ${userId} is deleted!`);

      return `The task with ID ${userId} is deleted!`;
    } catch (err) {
      this.logger.error(`The user with ID ${userId} is not found!`, err.stack);
      throw err;
    }
  }

  async getUsers(skip: number, limit: number): Promise<Object | string> {
    try {
      skip = skip ? skip : 0;
      limit = limit ? limit : 2;

      // console.log(typeof skip);
      // console.log(typeof limit);

      //   const query = this.createQueryBuilder('user').limit(limit).skip(skip);
      //   const users = await query.getMany();

      const users = await this.find();

      if (users.length === 0) {
        this.logger.log('No data to show!!');
        return 'There are no users to show!';
      }

      this.logger.verbose(`User's list is loaded! Data: ${users}`);

      return users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }));
    } catch (err) {
      this.logger.error(`Failed to load the users list`, err.stack);
      throw err;
    }
  }
}
