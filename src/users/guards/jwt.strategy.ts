import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersRepository } from '../repositories/users.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger = new Logger();

  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { id, role } = payload;
    try {
      const user: User = await this.usersRepository.findOne(id);

      if (!user) {
        throw new UnauthorizedException('The user is not Authorized!');
      }

      const extractedUser = { id: id, role: role };

      this.logger.verbose(
        `The extracted user information: ${JSON.stringify(extractedUser)}`,
      );

      return extractedUser;
    } catch (err) {
      this.logger.error('Unauthorized user security breach!', err.stack);
      throw err;
    }
  }
}
