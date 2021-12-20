import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { GoogleGuard } from '../guards/google.guard';
import { UsersService } from '../services/users.service';

@Controller('google')
export class GoogleController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(GoogleGuard)
  async googleAuth(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('redirect')
  @UseGuards(GoogleGuard)
  googleAuthRedirect(@Req() req) {
    if (!req.user) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        data: 'No user found',
      };
    }
    return this.usersService.createUser(req.user);
  }
}
