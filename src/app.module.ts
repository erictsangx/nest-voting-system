import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WrapperInterceptor } from './core/wrapper.interceptor';
import { CampaignModule } from './campaign/campaign.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongoadmin:pass@localhost:27017/votingSystem?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false'),
    AuthModule,
    UserModule,
    CampaignModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: WrapperInterceptor,
    },
    AppService
  ],
})
export class AppModule {}
