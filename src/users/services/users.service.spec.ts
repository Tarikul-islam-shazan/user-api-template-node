import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UsersRepository } from '../repositories/users.repository';
import { UsersService } from './users.service';
import { IsEmail } from 'class-validator';

// const mockBcrypt = () => ({
//     compare: jest.fn()
// })

const mockLogin = {
  email: 'email',
  password: 'password',
};

const mockUser = {
  id: 'someId',
  firstName: 'first',
  lastname: 'last',
  email: 'email',
  role: 'role',
};

const mockUsersRepository = () => ({
  getUsers: jest.fn(),
  getSingleUser: jest.fn(),
  addUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  findOne: jest.fn(),
});

const mockJwtService = () => ({});

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository;

  beforeEach(async () => {
    //initialize a module with usersService and usersRepository
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    usersService = module.get(UsersService);
    usersRepository = module.get(UsersRepository);
  });

  describe('getUsers', () => {
    it('calls UsersRepository.getUsers and returns the result', async () => {
      expect(usersRepository.getUsers).not.toHaveBeenCalled();
      usersRepository.getUsers.mockResolvedValue('someValue');
      const result = await usersService.getUsers(null, null);
      expect(usersRepository.getUsers).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getSingleUser', () => {
    it('calls UsersRepository.getSingleUser and returns the result', async () => {
      usersRepository.getSingleUser.mockResolvedValue(mockUser);
      const result = await usersService.getSingleUser('someId');
      expect(result).toEqual(mockUser);
    });

    it('calls UsersRepository.getSingleUser and handles an error', async () => {
      usersRepository.getSingleUser.mockResolvedValue(null);
      expect(usersService.getSingleUser('someId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addUser', () => {
    it('calls UsersRepository.addUser and returns the result', async () => {
      usersRepository.addUser.mockResolvedValue(mockUser);
      const result = await usersService.addUser(null);
      expect(result).toEqual(mockUser);
    });

    it('calls UsersRepository.addUser and handles the error', async () => {
      usersRepository.addUser.mockResolvedValue(null);
      expect(usersService.addUser(null)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateUser', () => {
    it('calls UsersRepository.updateUser and returns the result', async () => {
      usersRepository.updateUser.mockResolvedValue(mockUser);
      const result = await usersService.updateUser('someId', null);
      expect(result).toEqual(mockUser);
    });

    it('calls UsersRepository.updateUser and handles the error', async () => {
      usersRepository.updateUser.mockResolvedValue(null);
      expect(usersService.updateUser('someId', null)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteUser', () => {
    it('calls UsersRepository.deleteUser and deletes the user', async () => {
      usersRepository.deleteUser.mockResolvedValue('user deleted');
      const result = await usersService.deleteUser('someId');
      expect(result).toEqual('user deleted');
    });

    it('calls UsersRepository.deleteUser and handles the error', async () => {
      usersRepository.deleteUser.mockResolvedValue(null);
      expect(usersService.deleteUser('someId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  //   describe('login', () => {
  //     it('calls UsersRepository.findone and checks if the user is valid', async () => {
  //       usersRepository.findOne.mockResolvedValue(mockLogin);
  //       mockBcrypt.compare.mockResolvedValue
  //       const result = await usersService.login(mockLogin);
  //       expect(result).toEqual('accessToken');
  //     });
  //   });
});
