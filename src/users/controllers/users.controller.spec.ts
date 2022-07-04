import { Test, TestingModule } from "@nestjs/testing";
import { UpdateUserDto } from "../dto/update-user.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { RoleBase } from "../enums/user-role.enum";
import { UsersService } from "../services/users.service";
import { UsersController } from "./users.controller";
import { ObjectID } from 'typeorm';
import { User } from "../entities/user.entity";

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const userList = [
    { firstName: 'john', lastName: 'doe', email: 'john@doe', role: RoleBase.user },
    { firstName: 'john2', lastName: 'doe', email: 'john2@doe', role: RoleBase.user }
  ]

  const mockUserService = {
    createUser: jest.fn().mockImplementation((createUserDto: CreateUserDto) => {
      return {
        id: ObjectID,
        ...createUserDto
      }
    }),
    updateUser: jest.fn().mockImplementation((userId: string, updateUserDto: UpdateUserDto, requestingUser: User) => {
      return {
        userId,
        ...updateUserDto
      }
    }),
    deleteUser: jest.fn().mockImplementation((userId: string, requestingUser: User) => {
      return {
        userId
      }
    }),
    getSingleUser: jest.fn().mockImplementation((userId: string, requestingUser: User) => {
      return {
        id: userId,
        firstName: 'john',
        lastName: 'doe',
        email: 'john@doe',
        role: RoleBase.user
      }
    }),
    getUsers: jest.fn().mockImplementation((numberToTake: number, numberToSkip: number, requestingUser: User) => {
      const usersAfterSkipping = userList.slice(numberToSkip);
      const filteredUsers = usersAfterSkipping.slice(0, numberToTake);
      return filteredUsers;
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
      ...mockUser
    })

    expect(mockUserService.createUser).toHaveBeenCalledWith(mockUser)
  })

  // it('should show all user', () => {

  // });

  it('should get users', () => {
    expect(usersController.getUsers(2, 1, null)).toEqual(userList.slice(1));
  });

  it('should get a users', () => {
    expect(usersController.getSingleUser('1', null)).toEqual({
      id: '1',
      firstName: 'john',
      lastName: 'doe',
      email: 'john@doe',
      role: RoleBase.user
    })
  });

  it('should update a user', () => {
    const mockUser: UpdateUserDto = { firstName: 'John', lastName: 'Doe', email: 'johndoe@gmail.com', password: 'johndoe' }
    expect(usersController.updateUser('1', mockUser, null)).toEqual({
      userId: '1',
      ...mockUser
    });
    expect(mockUserService.updateUser).toHaveBeenCalled();
  });

  it('should delete a user', () => {
    expect(usersController.deleteUser('1', null)).toEqual({
      userId: '1',
    });
    expect(mockUserService.deleteUser).toHaveBeenCalled();
  });


});
