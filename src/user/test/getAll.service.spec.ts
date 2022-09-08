import { getModelToken } from '@nestjs/mongoose';
import { TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections } from '../../../test/mock/db.mock';
import { createModule } from '../../../test/test.setup';
import { mockPaginationQuery } from '../../recipe/test/mock/recipe.mock';
import { User, UserDocument } from '../user.schema';
import { UserService } from '../user.service';
import { generateUsersFromDb } from './mock/user.model.mock';

describe('UserService.getAll()', () => {
  let service: UserService;
  let userModel: Model<UserDocument>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await createModule({ providers: [UserService] });

    service = module.get(UserService);
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(async () => {
    await userModel.db.dropDatabase();
  });

  afterAll(async () => {
    await closeConnections();
    await module.close();
  });

  it('should return paginated list of all users', async () => {
    await userModel.insertMany(generateUsersFromDb(20));
    const { items: defaultUsers } = await service.getAll(mockPaginationQuery());
    expect(defaultUsers).toHaveLength(10);

    const { pagination, items: allUsers } = await service.getAll({ page: 1, limit: 20 });
    expect(pagination.page).toEqual(1);
    expect(pagination.pageSize).toEqual(20);
    expect(pagination.totalItems).toEqual(20);
    expect(pagination.totalPages).toEqual(1);
    expect(pagination.hasNext).toBeFalsy();
    expect(pagination.hasPrevious).toBeFalsy();
    expect(allUsers).toHaveLength(20);

    const [first] = (await service.getAll({ page: 2, limit: 5 })).items;
    expect(first).toEqual(allUsers[5]);
  });

  it('should return empty array if no users are present', async () => {
    const { items: users } = await service.getAll(mockPaginationQuery());
    expect(users).toStrictEqual([]);
  });
});
