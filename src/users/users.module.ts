import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';
import { JwtStrategy } from './guards/jwt.strategy';
import { FacebookStrategy } from './guards/facebook.strategy';
import { FacebookController } from './controllers/facebook.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // FacebookAuthModule.forRoot({
    //   clientId: process.env.APP_ID,
    //   clientSecret: process.env.APP_SECRET,
    // }),
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
  ],
  controllers: [UsersController, FacebookController],
  providers: [UsersService, JwtStrategy, ConfigService, FacebookStrategy],
})
export class UsersModule {}
