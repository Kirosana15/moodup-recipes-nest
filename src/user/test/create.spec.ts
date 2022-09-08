import { getModelToken } from '@nestjs/mongoose';
import { TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections } from '../../../test/mock/db.mock';
import { createModule } from '../../../test/test.setup';
import { User, UserDocument } from '../user.schema';
import { UserService } from '../user.service';
import { mockCredentials, mockUsername } from './mock/user.model.mock';

describe('UserService.create()', () => {
  let service: UserService;
  let userModel: Model<UserDocument>;
  let saveSpy: jest.SpyInstance;
  let module: TestingModule;

  beforeAll(async () => {
    module = await createModule({ providers: [UserService] });

    service = module.get(UserService);
    userModel = module.get(getModelToken(User.name));
    saveSpy = jest.spyOn(userModel.prototype, 'save');
  });

  afterEach(async () => {
    userModel.db.dropDatabase();
  });

  afterAll(async () => {
    await closeConnections();
    await module.close();
  });

  it('should return user', async () => {
    const user = await service.create(mockCredentials);
    expect(user.username).toBe(mockUsername);
    const userFromDb = await service.getByUsername(mockUsername);
    expect(userFromDb?._id).toStrictEqual(user._id);
    expect(saveSpy).toBeCalledTimes(1);
  });
});
