import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { WrapperInterceptor } from './core/wrapper.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Voting-System')
    .setDescription('The Voting-System API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);

  app.useGlobalInterceptors(new WrapperInterceptor());
  await app.listen(3000);
}

// noinspection JSIgnoredPromiseFromCall
bootstrap();
