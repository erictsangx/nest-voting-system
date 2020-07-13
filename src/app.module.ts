import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WrapperInterceptor } from './core/wrapper.interceptor';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: WrapperInterceptor,
  }],
})
export class AppModule {}
