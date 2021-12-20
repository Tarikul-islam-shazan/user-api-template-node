import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { FacebookGuard } from '../guards/facebook.guard';
import { Request } from 'express';

@Controller('facebook')
export class FacebookController {
  @Get()
  @UseGuards(FacebookGuard)
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('callback')
  @UseGuards(FacebookGuard)
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }
}
