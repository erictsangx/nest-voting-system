import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { FooService } from './foo.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request as HttpRequest } from 'express';
import { Error } from 'mongoose';
import { IsNotEmpty } from 'class-validator';

class FooEntity {
  @IsNotEmpty()
  bar!: string;

}

@Controller()
export class FooController {
  constructor(
    private readonly appService: FooService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req: HttpRequest) {
    return req.user;
  }

  @Get('/invalid-object-id')
  invalidObjectId() {
    throw new Error.CastError('INVALID', null, '');
  }

  @Post('/validator')
  validator(@Body() payload: FooEntity) {
    return payload;
  }
}
