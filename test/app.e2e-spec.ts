import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { ResponseWrapper } from '../src/core/wrapper.interceptor';
import { FooService } from './foo.service';
import { FooController } from './foo.controller';
import * as request from 'supertest';
import * as Chance from 'chance';
import { AuthService } from '../src/auth/auth.service';

const rand = new Chance();

function wrapper<T>(result: T): ResponseWrapper<T> {
  return {
    result: result,
    statusCode: 200,
    message: ''
  };
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [FooService],
      controllers: [FooController]
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get(AuthService);
    await app.init();
  });

  it('wrap all responses', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(wrapper('Hello World!'));
  });

  it('catch mongo cast error', () => {
    return request(app.getHttpServer())
      .get('/invalid-object-id')
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Invalid ObjectId Format'
      });
  });

  it('test validator', () => {
    return request(app.getHttpServer())
      .post('/validator')
      .send({})
      .set('Accept', 'application/json')
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['bar should not be empty'],
        error: 'Bad Request'
      });
  });

  it('test validator:whitelist', () => {
    return request(app.getHttpServer())
      .post('/validator')
      .send({
        bar: 'foobar',
        dummy: 'should be ignored'
      })
      .set('Accept', 'application/json')
      .expect(201)
      .expect({
        statusCode: 201,
        message: '',
        result: {
          bar: 'foobar'
        }
      });
  });

  it('auth guard', () => {
    return request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', 'dddd')
      .expect(401)
      .expect({
        statusCode: 401,
        message: 'Unauthorized'
      });
  });

  it('JWT Authorization header', () => {
    const user = { username: rand.string(), id: rand.string() };
    const token = authService.sign(user);
    return request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect({
        statusCode: 200,
        message: '',
        result: {
          id: user.id,
          username: user.username,
        }
      });
  });

  afterEach(async () => {
    await app.close();
  });

});
