import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WrapperInterceptor } from './core/wrapper.interceptor';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forRoot('mongodb://mongoadmin:pass@localhost:27017/votingSystem?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false')
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: WrapperInterceptor,
  }],
})
export class AppModule {}
