import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ErrorMessage } from './constants';
import { LoginAuthGuard } from './login-auth.guard';
import { Request as HttpRequest } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @Post('/login')
  login(@Request() req: HttpRequest): string {
    return this.authService.sign(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req: HttpRequest) {
    return req.user;
  }
}
