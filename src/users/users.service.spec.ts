import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('find a user', async () => {
    // expect(service).toBeDefined();
    const result = await service.findOne('chris');
    expect(result).toEqual({
      userId: 2,
      username: 'chris',
      password: 'secret',
    });
  });
});
