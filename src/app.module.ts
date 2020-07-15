import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { WrapperInterceptor } from './core/wrapper.interceptor';
import { CampaignModule } from './campaign/campaign.module';
import { InvalidObjectIdExceptionFilter } from './core/invalid-object-id-exception.filter';
import { Mongo } from './core/constants';

@Module({
  imports: [
    MongooseModule.forRoot(Mongo.uri),
    AuthModule,
    UserModule,
    CampaignModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: WrapperInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: InvalidObjectIdExceptionFilter
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    },
  ],
})
export class AppModule {}
