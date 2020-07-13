import { Controller, Request, Get, Post, UseGuards, HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  @Get()
  getHello(): string {
    // return this.appService.getHello();
    return undefined
  }

  @ApiOperation({ summary: 'login a user' })
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        username: 'admin',
        password: 'adminPass'
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Wrong username/password' })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

}
