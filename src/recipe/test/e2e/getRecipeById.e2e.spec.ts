import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

import { sendRequest } from '../../../../test/helpers/request';
import { closeConnections } from '../../../../test/mock/db.mock';
import { MockGuards } from '../../../auth/guards/mock/guards';
import { generateUserFromDb } from '../../../user/test/mock/user.model.mock';
import { mockId } from '../mock/recipe.mock';
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
    await closeConnections();
    await module.close();
  });

  describe('/GET :id', () => {
    const idMock = mockId();
    const TEST_PATH = `/recipe/${idMock}`;
    it('should return a recipe with specified id', async () => {
      const res = await sendRequest(app, 'get', TEST_PATH, HttpStatus.OK, mockUser);
      expect(res.body).toBeDefined();
      expect(res.body._id).toEqual(idMock);
      expect(recipeService.getById).toBeCalledTimes(1);
    });
  });
});
