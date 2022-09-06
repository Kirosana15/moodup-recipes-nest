import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections, rootMongooseTestModule } from '../../mock/db.mock';
import { User, UserSchema } from '../user.schema';
import { UserService } from '../user.service';
import { mockCredentials, mockId } from './mock/user.model.mock';

describe('UserService.refreshToken()', () => {
  let service: UserService;
  let userModel: Model<UserService>;
  let module: TestingModule;

  beforeAll(async () => {
    jest.clearAllMocks();
    module = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
      providers: [UserService],
    }).compile();

    service = module.get(UserService);
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(async () => {
    userModel.db.dropDatabase();
  });

  afterAll(async () => {
    await closeConnections();
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a new refresh token', async () => {
    const newRefresh = await service.refreshToken(mockId, '');
    expect(newRefresh).toBeDefined();
  });

  it('should change users refreshToken in database', async () => {
    const user = await service.create(mockCredentials);
    await service.refreshToken(user._id, 'token');
    const changedUser = await service.getById(user._id);
    expect(user.refreshToken).not.toBe(changedUser?.refreshToken);
  });
});
