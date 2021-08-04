import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { userSchema } from 'src/users/model/user.model';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
