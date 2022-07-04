import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { FacebookGuard } from '../guards/facebook.guard';
import { UsersService } from '../services/users.service';

@Controller('facebook')
export class FacebookController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(FacebookGuard)
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('callback')
  @UseGuards(FacebookGuard)
  async facebookLoginRedirect(@Req() req): Promise<any> {
    if (!req.user) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        data: 'No user from facebook',
      };
    }
    return await this.usersService.createFacebookUser(req.user.user);
  }
}
