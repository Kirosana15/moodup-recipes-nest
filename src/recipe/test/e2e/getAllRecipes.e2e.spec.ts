import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

import { sendRequest } from '../../../../test/helpers/request';
import { RoleTypes } from '../../../auth/enums/roles';
import { MockGuards } from '../../../auth/guards/mock/guards';
import { PaginatedResults } from '../../../dto/paginatedResults.dto';
import { UserDto } from '../../../user/dto/user.dto';
import { generateUserFromDb } from '../../../user/test/mock/user.model.mock';
import { RecipeInfoDto } from '../../dto/recipe.dto';
import { setupApp, setupModule } from './setup';

describe('recipe', () => {
  let app: NestApplication;
  const mockUser = generateUserFromDb();
  let module: TestingModule;

  beforeAll(async () => {
    module = await setupModule();
    app = await setupApp(module, MockGuards.AdminOnly);
  });

  afterAll(async () => {
    await module.close();
    await app.close();
  });

  describe('/GET all', () => {
    const TEST_PATH = '/recipe/all';
    const request = (status: HttpStatus, user: UserDto, query?: Record<string, unknown>) =>
      sendRequest(app, 'get', TEST_PATH, status, user, query);
    it('should require user to be an admin', async () => {
      await request(HttpStatus.FORBIDDEN, mockUser);
    });

    it('should return list of all recipes', async () => {
      mockUser.roles.push(RoleTypes.Admin);
      const res = await request(HttpStatus.OK, mockUser);
      expect(res.body).toBeDefined();
      const { pagination, items }: PaginatedResults<RecipeInfoDto> = res.body;
      expect(items).toHaveLength(10);
      expect(pagination.page).toEqual(1);
      expect(pagination.pageSize).toEqual(10);
      expect(pagination.totalItems).toEqual(15);
      expect(pagination.totalPages).toEqual(2);
      expect(pagination.hasNext).toBeTruthy();
      expect(pagination.hasPrevious).toBeFalsy();
    });

    it(`should return ${HttpStatus.BAD_REQUEST} when page is not a number`, async () => {
      await request(HttpStatus.BAD_REQUEST, mockUser, { page: 'two' });
    });

    it(`should return ${HttpStatus.BAD_REQUEST} when limit is not a number`, async () => {
      await request(HttpStatus.BAD_REQUEST, mockUser, { limit: 'two' });
    });

    it('should return paginated list', async () => {
      const res = await request(HttpStatus.OK, mockUser, { limit: 5 });
      const { pagination, items }: PaginatedResults<RecipeInfoDto> = res.body;
      expect(items).toBeDefined();
      expect(items).toHaveLength(5);
      expect(pagination.pageSize).toEqual(5);
      expect(pagination.totalPages).toEqual(2);
    });
  });
});
