import { Test, TestingModule } from "@nestjs/testing";
import { ObjectID } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { User } from "../entities/user.entity";
import { UsersService } from "./users.service";
import { UsersRepository } from "../repositories/users.repository";
import { CreateUserDto } from "../dto/create-user.dto";
import { RoleBase } from "../enums/user-role.enum";
import { UpdateUserDto } from "../dto/update-user.dto";
import { LoginUserDto } from "../dto/login-user.dto";


describe('UsersService', () => {
    let service: UsersService;
    let usersRepository: UsersRepository;

    const mockJwtSercice = () => ({});

    // const mockUsersRepository = {
    //     create: jest.fn().mockImplementation(dto => dto),
    //     save: jest.fn().mockImplementation(user => Promise.resolve({ id: ObjectID, ...user }))
    // }
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
        updateUser: jest.fn().mockImplementation((userId: string, updateUserDto: UpdateUserDto, requestingUser: User) => {
            return {
                userId,
                ...updateUserDto
            }
        }),
        deleteUser: jest.fn().mockImplementation((userId: string, requestingUser: User) => {

        }),
        login: jest.fn().mockImplementation((loginUserDto: LoginUserDto) => {

        }),
        dashboard: jest.fn().mockImplementation((userInfo: User) => {

        }),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: JwtService, useFactory: mockJwtSercice }
            ]
        })
            .overrideProvider(UsersService)
            .useValue(mockUserService).
            compile();


        service = module.get<UsersService>(UsersService);
        usersRepository = module.get<UsersRepository>(UsersRepository)
    });

    it('should be define', () => {
        expect(service).toBeDefined();
    });

    it('should create a new user', async () => {
        const mockUser: CreateUserDto = { firstName: 'John', lastName: 'Doe', email: 'johndoe@gmail.com', password: 'johndoe', role: RoleBase.user };

        expect(await service.createUser(mockUser)).toEqual({
            id: ObjectID,
            ...mockUser
        });
    });

    it('should update a user', () => {
        const mockUser: UpdateUserDto = { firstName: 'John', lastName: 'Doe', email: 'johndoe@gmail.com', password: 'johndoe' }
        expect(service.updateUser('1', mockUser, null)).toEqual({
            id: '1',
            ...mockUser
        });
    });

});


