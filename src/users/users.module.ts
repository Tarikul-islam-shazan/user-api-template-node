import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';
import { JwtStrategy } from './guards/jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { MulterModule } from '@nestjs/platform-express';
import { GoogleController } from './controllers/google.controller';
import { GoogleStrategy } from './guards/google.strategy';
import { FacebookStrategy } from './guards/facebook.strategy';
import { FacebookController } from './controllers/facebook.controller';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
    TypeOrmModule.forFeature([UsersRepository]),
    HttpModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get('FILE_PATH'),
      }),
    }),
  ],

  controllers: [UsersController, GoogleController, FacebookController],
  providers: [UsersService, JwtStrategy, GoogleStrategy, ConfigService, FacebookStrategy, ConfigService, RolesGuard],

})
export class UsersModule {}
