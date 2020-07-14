import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { Chance } from 'chance';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let jwt: JwtService;

  //test samples
  const rand = new Chance();
  const userA = {
    id: rand.string(),
    username: rand.string(),
    password: rand.string()
  };

  const mockUsersService = {
    findOne: async function (username: string) {
      const pass = await argon2.hash(userA.password, { type: argon2.argon2id });
      const tmp = {
        ...userA, toObject: function () {
          return this;
        }
      };
      tmp.password = pass;
      return tmp.username == username ? tmp : null;
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, {
        provide: UsersService,
        useValue: mockUsersService
      }],
      imports: [PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '2h' },
        })
      ]
    }).compile();

    service = module.get(AuthService);
    jwt = module.get(JwtService);

  });

  it('validate a user with password', async () => {
    const result = await service.validateUser(userA.username, userA.password);
    const { password, ...answer } = userA;
    expect(result).toMatchObject(answer);

    //wrong username
    const wrongUsername = await service.validateUser(rand.string(), userA.password);
    expect(wrongUsername).toBeNull();

    //wrong password
    const wrongPassword = await service.validateUser(userA.username, userA.password + rand.string());
    expect(wrongPassword).toBeNull();

  });

  it('sign and verify', () => {
    const token = service.sign(userA);
    const result = jwt.verify(token);
    expect(result).toMatchObject({
      sub: userA.id,
      username: userA.username
    });
  });
});
