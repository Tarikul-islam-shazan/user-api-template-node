/* eslint-disable @typescript-eslint/no-empty-function */
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { JwtGuard } from '../guards/jwt.guard';
import { UsersRepository } from '../repositories/users.repository';
import { UsersService } from '../services/users.service';
import { UsersController } from './users.controller';

const mockUser = {
  id: 'someID',
  firstName: 'first',
  lastName: 'last',
  email: 'email',
  role: 'role',
};

const mockAuthGuard = () => ({});

const mockUsersRepository = () => ({
  getUsers: jest.fn(),
  createUser: jest.fn(),
  getSingleUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
});

const mockJwtService = () => {};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService;
  let usersRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
      ],
    })
      .overrideProvider(JwtGuard)
      .useClass(mockAuthGuard)
      .compile();

    usersController = module.get(UsersController);
    usersService = module.get(UsersService);
    usersRepository = module.get(UsersRepository);
  });

  describe('getUsers', () => {
    it('should return an array of users or a message', async () => {
      usersRepository.getUsers.mockResolvedValue('someValue');
      const result = await usersService.getUsers(null, null);
      const finalResult = await usersController.getUsers(null, null, null);

      expect(finalResult).toEqual(result);
    });
  });

  describe('createUser', () => {
    it('should create a user and return the result', async () => {
      usersRepository.createUser.mockResolvedValue(mockUser);
      const result = await usersService.createUser(null);
      const finalResult = await usersController.createUser(null);

      expect(finalResult).toEqual(result);
    });
  });

  describe('singleUser', () => {
    it('should find a user by ID and return the result', async () => {
      usersRepository.getSingleUser.mockResolvedValue(mockUser);
      const result = await usersService.getSingleUser(null, null);
      const finalResult = await usersController.getSingleUser(null, null);

      expect(finalResult).toEqual(result);
    });
  });

  describe('updateUser', () => {
    it('should find a user by ID, update the user and return the result', async () => {
      usersRepository.updateUser.mockResolvedValue(mockUser);
      const result = await usersService.updateUser(null, null, null);
      const finalResult = await usersController.updateUser(null, null, null);

      expect(finalResult).toEqual(result);
    });
  });

  describe('deleteUser', () => {
    it('should find a user by ID, delete it and return the result', async () => {
      usersRepository.deleteUser.mockResolvedValue(
        'The task with userId is deleted!',
      );
      const result = await usersService.deleteUser(null, null);
      const finalResult = await usersController.deleteUser(null, null);

      expect(finalResult).toEqual(result);
    });
  });
});
