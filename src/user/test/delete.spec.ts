import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { UserDto } from '../dto/user.dto';
import { User, UserDocument, UserSchema } from '../user.schema';
import { UserService } from '../user.service';
import { closeConnections, rootMongooseTestModule } from './mock/db.mock';
import { generateUserFromDb, mockId } from './mock/user.model.mock';

describe('UserService.delete()', () => {
  let service: UserService;
  let userMock: Model<UserDocument>;
  const mockUser = generateUserFromDb();
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
      providers: [UserService],
    }).compile();

    service = module.get(UserService);
    userMock = module.get(getModelToken(User.name));
  });

  afterAll(async () => {
    await closeConnections();
  });

  it('should return deleted recipe', async () => {
    const user: UserDto = (await userMock.create(mockUser)).toObject();
    const deletedUser = await service.delete(user._id);
    expect(deletedUser?._id).toStrictEqual(user._id);
  });
  it('should return null when user does not exist', async () => {
    const deletedUser = await service.delete(mockId);
    expect(deletedUser).toBeNull();
  });
});
