import { Test, TestingModule } from '@nestjs/testing';
import { User, UserSchema } from '../user.schema';
import { closeConnections, rootMongooseTestModule } from './mock/db.mock';
import { mockCredentials, mockId } from './mock/user.model.mock';

import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '../user.service';

describe('UserService.refreshToken()', () => {
  let service: UserService;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
      providers: [UserService],
    }).compile();

    service = module.get(UserService);
  });

  afterAll(async () => {
    await closeConnections();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a new refresh token', async () => {
    const newRefresh = await service.refreshToken(mockId);
    expect(newRefresh).toBeDefined();
  });

  it('should change users check value in database', async () => {
    const user = await service.create(mockCredentials);
    await service.refreshToken(user._id);
    const changedUser = await service.getById(user._id);
    expect(user.check).not.toBe(changedUser?.check);
  });
});
