import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections, rootMongooseTestModule } from '../../mock/db.mock';
import { User, UserDocument, UserSchema } from '../user.schema';
import { UserService } from '../user.service';
import { generateUserFromDb, mockId } from './mock/user.model.mock';

describe('UserService.getById()', () => {
  let service: UserService;
  let userMock: Model<UserDocument>;
  let findByIdSpy: jest.SpyInstance;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
      providers: [UserService],
    }).compile();

    service = module.get(UserService);
    userMock = module.get(getModelToken(User.name));
    findByIdSpy = jest.spyOn(userMock, 'findById');
  });

  afterAll(async () => {
    await closeConnections();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user', async () => {
    findByIdSpy.mockReturnValue({ lean: () => ({ exec: () => generateUserFromDb({ _id: mockId }) }) });
    const user = await service.getById(mockId);
    expect(user).toBeDefined();
    expect(user?._id).toBe(mockId);
    expect(findByIdSpy).toBeCalledTimes(1);
  });
});
