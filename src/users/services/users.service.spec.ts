import { Test, TestingModule } from "@nestjs/testing";
import { ObjectID } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { User } from "../entities/user.entity";
import { UsersService } from "./users.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { RoleBase } from "../enums/user-role.enum";
import { UpdateUserDto } from "../dto/update-user.dto";


describe('UsersService', () => {
    let usersService: UsersService;

    const mockJwtSercice = () => ({});

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
                id: userId,
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
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: JwtService, useFactory: mockJwtSercice }
            ]
        })
            .overrideProvider(UsersService)
            .useValue(mockUserService).
            compile();


        usersService = module.get<UsersService>(UsersService);
    });

    it('should be define', () => {
        expect(usersService).toBeDefined();
    });

    it('should create a new user', async () => {
        const mockUser: CreateUserDto = { firstName: 'John', lastName: 'Doe', email: 'johndoe@gmail.com', password: 'johndoe', role: RoleBase.user };

        expect(await usersService.createUser(mockUser)).toEqual({
            id: ObjectID,
            ...mockUser
        });
    });


    it('should get users', () => {
        expect(usersService.getUsers(2, 1, null)).toEqual(userList.slice(1));
    });

    it('should get a users', () => {
        expect(usersService.getSingleUser('1', null)).toEqual({
            id: '1',
            firstName: 'john',
            lastName: 'doe',
            email: 'john@doe',
            role: RoleBase.user
        })
    });

    it('should update a user', () => {
        const mockUser: UpdateUserDto = { firstName: 'John', lastName: 'Doe', email: 'johndoe@gmail.com', password: 'johndoe' }
        expect(usersService.updateUser('1', mockUser, null)).toEqual({
            id: '1',
            ...mockUser
        });
    });

    it('should delete a user', () => {
        expect(usersService.deleteUser('1', null)).toEqual({
            userId: '1',
        });
        expect(mockUserService.deleteUser).toHaveBeenCalled();
    });

});


