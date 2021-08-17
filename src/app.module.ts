require('dotenv').config();

import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    // MongooseModule.forRoot(
    //   `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
    //   {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //     autoIndex: false,
    //   },
    // ),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'user-management',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
