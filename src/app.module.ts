import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { WrapperInterceptor } from './core/wrapper.interceptor';
import { CampaignModule } from './campaign/campaign.module';
import { InvalidObjectIdExceptionFilter } from './core/invalid-object-id-exception.filter';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongoadmin:pass@localhost:27017/votingSystem?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false'),
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
