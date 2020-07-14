import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Chance } from 'chance';

describe('Auth Controller', () => {
  let controller: AuthController;

  //test samples
  const rand = new Chance();
  const userA = {
    id: rand.string(),
    username: rand.string(),
    password: rand.string()
  };

  const mockAuthService = {
    sign: jest.fn()
  };
  const mockReq = {
    user: { ...userA }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('login a user', () => {
    const token = rand.string();
    mockAuthService.sign.mockReturnValue(token);
    const result = controller.login(mockReq as any);
    expect(result).toBe(token);
    expect(mockAuthService.sign).toBeCalledWith(mockReq.user);
  });
});
