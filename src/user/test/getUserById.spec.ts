import { getModelToken } from '@nestjs/mongoose';
import { TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections } from '../../../test/mock/db.mock';
import { createModule } from '../../../test/test.setup';
import { User, UserDocument, UserSchema } from '../user.schema';
import { UserService } from '../user.service';
import { generateUserFromDb, mockId } from './mock/user.model.mock';

describe('UserService.getById()', () => {
  let service: UserService;
  let userModel: Model<UserDocument>;
  let findByIdSpy: jest.SpyInstance;
  let module: TestingModule;

  beforeAll(async () => {
    module = await createModule({ providers: [UserService], model: [{ name: User.name, schema: UserSchema }] });

    service = module.get(UserService);
    userModel = module.get(getModelToken(User.name));
    findByIdSpy = jest.spyOn(userModel, 'findById');
  });

  afterEach(async () => {
    await userModel.db.dropDatabase();
  });

  afterAll(async () => {
    await closeConnections();
    await module.close();
  });

  it('should return user', async () => {
    findByIdSpy.mockReturnValue({ lean: () => ({ exec: () => generateUserFromDb({ _id: mockId }) }) });
    const user = await service.getById(mockId);
    expect(user).toBeDefined();
    expect(user?._id).toBe(mockId);
    expect(findByIdSpy).toBeCalledTimes(1);
  });
});
