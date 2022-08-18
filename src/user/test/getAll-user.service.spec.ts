import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User, UserDocument, UserSchema } from '../user.schema';
import { UserService } from '../user.service';
import { closeConnections, rootMongooseTestModule } from './mock/db.mock';
import { generateCredentialsList } from './mock/user.model.mock';

describe('UserService.getAll()', () => {
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
    saveSpy = jest.spyOn(userMock, 'find');
  });

  afterAll(async () => {
    await closeConnections();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated list of all users', async () => {
    await userMock.insertMany(generateCredentialsList(20));
    const defaultUsers = await service.getAll();
    expect(defaultUsers).toHaveLength(10);
    const allUsers = await service.getAll(undefined, 20);
    expect(allUsers).toHaveLength(20);
    const [first] = await service.getAll(2, 5);
    expect(first).toEqual(allUsers[5]);
  });

  it('should return empty array if no users are present', async () => {
    const users = await service.getAll();
    expect(users).toStrictEqual([]);
  });
});
