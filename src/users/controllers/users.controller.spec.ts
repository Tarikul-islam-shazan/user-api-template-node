import { Test, TestingModule } from "@nestjs/testing";
import { UpdateUserDto } from "../dto/update-user.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { RoleBase } from "../enums/user-role.enum";
import { UsersService } from "../services/users.service";
const httpMocks = require('node-mocks-http');
import { UsersController } from "./users.controller";
import { DeleteResult, UpdateResult, ObjectID } from 'typeorm';
import { User } from "../entities/user.entity";
import { LoginUserDto } from "../dto/login-user.dto";

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;



  const mockRequest = httpMocks.createRequest();
  mockRequest.user = new User();
  mockRequest.user.firstName = 'Jon';


  const mockDeleteResult: DeleteResult = {
    raw: [],
    affected: 1,
  };

  const mockUpdateResult: UpdateResult = {
    ...mockDeleteResult,
    generatedMaps: [],
  };

  const mockUserService = {
    createUser: jest.fn().mockImplementation((createUserDto: CreateUserDto) => {
      return {
        id: ObjectID,
        ...createUserDto
      }
    }),
    getUsers: jest.fn().mockImplementation((skip: number, limit: number, requestingUser: User) => {

    }),
    getSingleUser: jest.fn().mockImplementation((userId: string, requestingUser: User) => {

    }),
    updateUser: jest.fn().mockImplementation(() => {
      return mockUpdateResult;
    }),
    deleteUser: jest.fn().mockImplementation(() => {
      return mockDeleteResult;
    }),
    login: jest.fn().mockImplementation((loginUserDto: LoginUserDto) => {

    }),
    dashboard: jest.fn().mockImplementation((userInfo: User) => {

    }),
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


  // it('should create a new user2', () => {
  //   expect(usersController.createUser(mockRequest))
  // })
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
  //   expect(usersController.deleteUser('1',mockRequest)).toEqual(mockDeleteResult);
  // });


});
