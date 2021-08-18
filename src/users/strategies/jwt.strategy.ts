import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersRepository } from '../repositories/users.repository';
import { User } from './../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger = new Logger();

  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {
    super({
      secretOrKey: 'kotha123',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { id, role } = payload;
    try {
      const user: User = await this.usersRepository.findOne(id);

      if (user.role !== 'admin') {
        throw new UnauthorizedException('The user is not Authorized!');
      }

      const extractedUser = { userId: id, userRole: role };

      this.logger.verbose(`The extracted user information: ${extractedUser}`);

      return extractedUser;
    } catch (err) {
      this.logger.error('Unauthorized users security breach!', err.stack);
      throw err;
    }
  }
}
