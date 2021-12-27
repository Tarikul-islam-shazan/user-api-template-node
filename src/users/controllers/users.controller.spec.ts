import { Test, TestingModule } from "@nestjs/testing";
import { UpdateUserDto } from "../dto/update-user.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { RoleBase } from "../enums/user-role.enum";
import { UsersService } from "../services/users.service";
const httpMocks = require('node-mocks-http');
import { UsersController } from "./users.controller";
import { ObjectID } from 'typeorm';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUserService = {
    createUser: jest.fn(dto => {
      return {
        id: ObjectID,
        ...dto
      }
    }),
    updateUser: jest.fn().mockImplementation((id, dto) => {
      return {
        id,
        ...dto
      }
    })
  }

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService
      ]
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile()

    usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);

  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });


  it('should create a new user', () => {
    const mockUser: CreateUserDto = { firstName: 'John', lastName: 'Doe', email: 'johndoe@gmail.com', password: 'johndoe', role: RoleBase.user };
    expect(usersService.createUser(mockUser)).toEqual({
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
      password: mockUser.password,
      role: mockUser.role
    })

    expect(mockUserService.createUser).toHaveBeenCalledWith(mockUser)
  })

  // it('should show all user', () => {

  // });

  // it('should show a user', () => {

  // });

  it('should update a user', () => {
    const mockUser: UpdateUserDto = { firstName: 'John', lastName: 'Doe', email: 'johndoe@gmail.com', password: 'johndoe' }
    expect(usersController.updateUser('1', mockUser, null)).toEqual({
      id: '1',
      ...mockUser
    });
    expect(mockUserService.updateUser).toHaveBeenCalled();
  });

  // it('should delete a user', () => {

  // });


});
