import { getModelToken } from '@nestjs/mongoose';
import { TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections } from '../../../../test/mock/db.mock';
import { createModule } from '../../../../test/test.setup';
import { User, UserDocument, UserSchema } from '../../user.schema';
import { UserService } from '../../user.service';
import { generateUserFromDb, mockUsername } from '../mock/user.model.mock';

describe('UserService.getByUsername()', () => {
  let service: UserService;
  let userModel: Model<UserDocument>;
  let findOneSpy: jest.SpyInstance;
  let module: TestingModule;

  beforeAll(async () => {
    module = await createModule({ providers: [UserService], model: [{ name: User.name, schema: UserSchema }] });

    service = module.get(UserService);
    userModel = module.get(getModelToken(User.name));
    findOneSpy = jest.spyOn(userModel, 'findOne');
  });

  afterEach(async () => {
    await userModel.db.dropDatabase();
  });

  afterAll(async () => {
    await closeConnections();
    await module.close();
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
