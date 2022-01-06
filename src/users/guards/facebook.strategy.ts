import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  logger = new Logger();
  constructor() {
    super({
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: 'http://localhost:3000/facebook/callback',
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      firstName: name.givenName,
      lastName: name.familyName,
      email: emails[0].value,
      // password: this.makePasswd(),
      role: 'user',
    };
    // console.log('password', this.makePasswd());
    const payload = {
      user,
      accessToken,
    };
    done(null, payload);
  }

  // makePasswd() {
  //   let passwd = '';
  //   const chars =
  //     'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  //   for (let i = 1; i < 10; i++) {
  //     const c = Math.floor(Math.random() * chars.length + 1);
  //     passwd += chars.charAt(c);
  //   }
  //   return passwd;
  // }
}
