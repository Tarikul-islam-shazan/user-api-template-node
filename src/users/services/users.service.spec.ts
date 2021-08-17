// import { Test, TestingModule } from '@nestjs/testing';
// import { RoleBase } from '../interfaces/user-role.enum';
// import { UsersService } from './users.service';

// const mockUser = {
//   firstName: 'Ahmed',
//   lastName: 'Bari',
//   email: 'xyz@gmail.com',
//   password: 'ahmedBari',
//   role: RoleBase.user,
// };

// const resultUser = {
//   firstName: 'Ahmed',
//   lastName: 'Bari',
//   email: 'xyz@gmail.com',
//   role: RoleBase.user,
// };

// describe('UsersService', () => {
//   let service: UsersService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [UsersService],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//   });

//   describe('addUser', () => {
//     it('gets the new user information and registers them', async () => {
//       const result = await service.addUser(mockUser);
//       expect(result).toEqual(mockUser);
//     });
//   });
// });
