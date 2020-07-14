import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginAuthGuard } from './auth/login-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request as HttpRequest } from 'express';
import { ErrorMessage } from './auth/constants';
import { User } from './users/user.schema';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: 'login a user' })
  @ApiBody({
    schema: {
      example: {
        username: 'admin',
        password: 'adminPass'
      }
    }
  })
  @ApiUnauthorizedResponse({ description: ErrorMessage.loginFailed })
  @UseGuards(LoginAuthGuard)
  @Post('auth/login')
  login(@Request() req: HttpRequest): string {
    return this.authService.sign(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: HttpRequest) {
    console.log('req.user', req.user);
    return req.user;
  }

}
