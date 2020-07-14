import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

import { GenericContainer } from 'testcontainers';
import { StartedTestContainer } from 'testcontainers/dist/test-container';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';

import { Chance } from 'chance';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;
  let container: StartedTestContainer;

  //test samples
  const rand = new Chance();
  const userA = {
    _id: new mongoose.Types.ObjectId(),
    username: rand.string(),
    password: rand.string()
  };
  const userB = {
    _id: new mongoose.Types.ObjectId(),
    username: rand.string(),
    password: rand.string()
  };

  beforeAll(async () => {
    //init test containers
    container = await new GenericContainer('mongo', '4.2.8-bionic')
      .withExposedPorts(27017)
      .withEnv('MONGO_INITDB_ROOT_USERNAME', 'mongoadmin')
      .withEnv('MONGO_INITDB_ROOT_PASSWORD', 'pass')
      .start();
  }, 6 * 10 * 1000);

  beforeEach(async () => {

    const port = container.getMappedPort(27017);
    const ip = container.getContainerIpAddress();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(`mongodb://mongoadmin:pass@${ip}:${port}/votingSystem?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false`),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>('UserModel');

    await new model(userA).save();
    await new model(userB).save();
  });

  it('find a user', async () => {
    const result = await service.findOne(userA.username);
    const tmp = result?.toObject();
    delete tmp.__v;
    expect(tmp).toMatchObject(userA);

    const notFound = await service.findOne(rand.string());
    expect(notFound).toBeNull();

  });

  afterEach(async () => {
    await model.deleteMany({});
  });

  afterAll(async () => {
    await container.stop();
  });
});
