import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

import { sendRequest } from '../../../../test/helpers/request';
import { MockGuards } from '../../../auth/guards/mock/guards';
import { generateUserFromDb } from '../../../user/test/mock/user.model.mock';
import { mockRecipeService } from '../mock/recipeService.mock';
import { setupApp, setupModule } from './setup';

describe('recipe', () => {
  let app: NestApplication;
  const recipeService = mockRecipeService;
  const mockUser = generateUserFromDb();
  let module: TestingModule;

  beforeAll(async () => {
    module = await setupModule();
    app = await setupApp(module, MockGuards.Simple);
  });

  afterAll(async () => {
    await module.close();
    await app.close();
  });

  describe('/GET :id', () => {
    const TEST_PATH = `/recipe/${mockUser._id}`;
    it('should return a recipe with specified id', async () => {
      const res = await sendRequest(app, 'get', TEST_PATH, HttpStatus.OK, mockUser);
      expect(res.body).toBeDefined();
      expect(res.body._id).toEqual(mockUser._id);
      expect(recipeService.getById).toBeCalledTimes(1);
    });
  });
});
