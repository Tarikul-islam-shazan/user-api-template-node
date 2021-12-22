import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UsersRepository } from '../repositories/users.repository';
import { UsersService } from './users.service';

// const mockBcrypt = () => ({
//   compare: jest.fn(),
// });

// const mockLogin = {
//   email: 'email',
//   password: 'password',
// };

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
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  findOne: jest.fn(),
});

const mockJwtService = () => ({});

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository;
  // let userBcrypt;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
        { provide: JwtService, useFactory: mockJwtService },
        // { provide: mockBcrypt, useFactory: mockBcrypt },
      ],
    }).compile();

    usersService = module.get(UsersService);
    usersRepository = module.get(UsersRepository);
    // userBcrypt = module.get(mockBcrypt);
  });

  describe('getUsers', () => {
    it('calls UsersRepository.getUsers and returns the result', async () => {
      usersRepository.getUsers.mockResolvedValue('someValue');
      const result = await usersService.getUsers(null, null, null);

      expect(result).toEqual('someValue');
    });
  });

  describe('getSingleUser', () => {
    it('calls UsersRepository.getSingleUser and returns the result', async () => {
      usersRepository.getSingleUser.mockResolvedValue(mockUser);
      const result = await usersService.getSingleUser('someId', null);

      expect(result).toEqual(mockUser);
    });

    it('calls UsersRepository.getSingleUser and handles an error', async () => {
      usersRepository.getSingleUser.mockResolvedValue(null);

      expect(usersService.getSingleUser('someId', null)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('calls UsersRepository.createUser and returns the result', async () => {
      usersRepository.createUser.mockResolvedValue(mockUser);
      const result = await usersService.createUser(null);

      expect(result).toEqual(mockUser);
    });

    it('calls UsersRepository.createUser and handles the error', async () => {
      usersRepository.createUser.mockResolvedValue(null);

      expect(usersService.createUser(null)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateUser', () => {
    it('calls UsersRepository.updateUser and returns the result', async () => {
      usersRepository.updateUser.mockResolvedValue(mockUser);
      const result = await usersService.updateUser('someId', null, null);

      expect(result).toEqual(mockUser);
    });

    it('calls UsersRepository.updateUser and handles the error', async () => {
      usersRepository.updateUser.mockResolvedValue(null);

      expect(usersService.updateUser('someId', null, null)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteUser', () => {
    it('calls UsersRepository.deleteUser and deletes the user', async () => {
      usersRepository.deleteUser.mockResolvedValue('user deleted');
      const result = await usersService.deleteUser('someId', null);

      expect(result).toEqual('user deleted');
    });

    it('calls UsersRepository.deleteUser and handles the error', async () => {
      usersRepository.deleteUser.mockResolvedValue(null);

      expect(usersService.deleteUser('someId', null)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // describe('login', () => {
  //   it('calls UsersRepository.findone and checks if the user is valid', async () => {
  //     usersRepository.findOne.mockResolvedValue('valid');
  //     userBcrypt.compare.mockResolvedValue('valid')
  //     const result = await usersService.login(mockLogin);
  //     expect(result).toEqual('accessToken');
  //   });
  // });
});
