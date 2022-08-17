import { getModelToken, InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User, UserDocument, UserSchema } from '../user.schema';
import { UserService } from '../user.service';
import { closeConnections, rootMongooseTestModule } from './mock/db.mock';
import { mockCredentials, mockPassword, mockUsername, UserMock } from './mock/user.model.mock';

describe('UserService.create()', () => {
  let service: UserService;
  let userMock: Model<UserDocument>;
  let saveSpy: jest.SpyInstance;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
      providers: [UserService],
    }).compile();

    service = module.get(UserService);
    userMock = module.get(getModelToken(User.name));
    saveSpy = jest.spyOn(userMock.prototype, 'save');
  });

  afterAll(async () => {
    await closeConnections();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user', async () => {
    const user = await service.create(mockCredentials);
    expect(user.username).toBe(mockUsername);
    const userFromDb = await service.getByUsername(mockUsername);
    expect(userFromDb?._id).toStrictEqual(user._id);
    expect(saveSpy).toBeCalledTimes(1);
  });
});
