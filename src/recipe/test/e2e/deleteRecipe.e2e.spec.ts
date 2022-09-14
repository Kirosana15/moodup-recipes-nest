import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

import { sendRequest } from '../../../../test/helpers/request';
import { MockGuards } from '../../../auth/guards/mock/guards';
import { generateUserFromDb } from '../../../user/test/mock/user.model.mock';
import { mockId } from '../mock/recipe.mock';
import { mockRecipeService } from '../mock/recipeService.mock';
import { setupApp, setupModule } from './setup';

describe('recipe', () => {
  let app: NestApplication;
  let module: TestingModule;
  const mockUser = generateUserFromDb();

  beforeAll(async () => {
    module = await setupModule();
    app = await setupApp(module, MockGuards.Owner);
  });

  afterAll(async () => {
    await module.close();
    await app.close();
  });

  describe('/DELETE :id', () => {
    const TEST_PATH = `/recipe/${mockUser._id}`;
    const request = (status: HttpStatus, path = TEST_PATH) => sendRequest(app, 'delete', path, status, mockUser);
    it('should return deleted recipe', async () => {
      const res = await request(HttpStatus.OK);
      expect(res.body).toBeDefined();
      expect(res.body._id).toEqual(mockUser._id);
    });
    it(`should return ${HttpStatus.NOT_FOUND} if recipe does not exist`, async () => {
      mockRecipeService.delete.mockReturnValueOnce(null);
      await request(HttpStatus.NOT_FOUND);
    });
    it(`should return ${HttpStatus.FORBIDDEN} if user is not an owner of a recipe`, async () => {
      await request(HttpStatus.FORBIDDEN, `/recipe/${mockId()}`);
    });
  });
});
