import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ErrorMessage } from './constants';
import { LoginAuthGuard } from './login-auth.guard';
import { Request as HttpRequest } from 'express';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    schema: {
      example: {
        username: 'admin',
        password: 'adminPass'
      }
    }
  })
  @ApiOperation({ summary: 'Return a JWT, expires in 2 hours' })
  @ApiUnauthorizedResponse({ description: ErrorMessage.LOGIN_FAILED })
  @UseGuards(LoginAuthGuard)
  @Post('/login')
  login(@Request() req: HttpRequest): string {
    return this.authService.sign(req.user);
  }

}
