import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User, UserDocument, UserSchema } from '../user.schema';
import { UserService } from '../user.service';
import { closeConnections, rootMongooseTestModule } from './mock/db.mock';
import { generateUserFromDb, mockCredentials, mockUsername } from './mock/user.model.mock';

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
    findOneSpy.mockReturnValue({ exec: () => generateUserFromDb({ username: mockUsername }) });
    const user = await service.getByUsername(mockUsername);
    expect(user).toBeDefined();
    expect(user?.username).toBe(mockUsername);
    expect(user?._id).toBeDefined;
    expect(findOneSpy).toBeCalledTimes(1);
  });
});
