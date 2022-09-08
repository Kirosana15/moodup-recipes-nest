import { getModelToken } from '@nestjs/mongoose';
import { TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections } from '../../../test/mock/db.mock';
import { createModule } from '../../../test/test.setup';
import { UserDto } from '../dto/user.dto';
import { User, UserDocument, UserSchema } from '../user.schema';
import { UserService } from '../user.service';
import { generateUserFromDb, mockId } from './mock/user.model.mock';

describe('UserService.delete()', () => {
  let service: UserService;
  let userModel: Model<UserDocument>;
  const mockUser = generateUserFromDb();
  let module: TestingModule;

  beforeAll(async () => {
    module = await createModule({ providers: [UserService], model: [{ name: User.name, schema: UserSchema }] });
    service = await module.get(UserService);
    userModel = await module.get(getModelToken(User.name));
  });

  afterEach(async () => {
    userModel.db.dropDatabase();
  });

  afterAll(async () => {
    await closeConnections();
    await module.close();
  });

  it('should return deleted user', async () => {
    const user: UserDto = (await userModel.create(mockUser)).toObject();
    const deletedUser = await service.delete(user._id);
    expect(deletedUser?._id).toStrictEqual(user._id);
  });

  it('should return null when user does not exist', async () => {
    const deletedUser = await service.delete(mockId);
    expect(deletedUser).toBeNull();
  });
});
