import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections, rootMongooseTestModule } from '../helpers/db.mock';
import { User, UserDocument, UserSchema } from '../user.schema';
import { UserService } from '../user.service';
import { generateUserFromDb, mockUsername } from './mock/user.model.mock';

describe('UserService.getByUsername()', () => {
  let service: UserService;
  let userMock: Model<UserDocument>;
  let findOneSpy: jest.SpyInstance;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
      providers: [UserService],
    }).compile();

    service = module.get(UserService);
    userMock = module.get(getModelToken(User.name));
    findOneSpy = jest.spyOn(userMock, 'findOne');
  });

  afterAll(async () => {
    await closeConnections();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user', async () => {
    const mockName = mockUsername;
    findOneSpy.mockReturnValue({ lean: () => ({ exec: () => generateUserFromDb({ username: mockName }) }) });
    const user = await service.getByUsername(mockName);
    expect(user).not.toBeNull();
    expect(user?.username).toBe(mockName);
    expect(user?._id).toBeDefined();
    expect(findOneSpy).toBeCalledTimes(1);
  });
});
