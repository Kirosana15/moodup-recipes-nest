import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

import { sendRequest } from '../../../../test/helpers/request';
import { MockGuards } from '../../../auth/guards/mock/guards';
import { generateUserFromDb } from '../../../user/test/mock/user.model.mock';
import { RecipeDto } from '../../dto/recipe.dto';
import { recipeMock } from '../mock/recipe.mock';
import { setupModule, setupApp } from './setup';

describe('recipe', () => {
  let app: NestApplication;
  const mockUser = generateUserFromDb();
  const mockRecipe = recipeMock();
  let module: TestingModule;

  beforeAll(async () => {
    module = await setupModule();
    app = await setupApp(module, MockGuards.Simple);
  });

  afterAll(async () => {
    await module.close();
    await app.close();
  });

  describe('/POST', () => {
    const TEST_PATH = '/recipe';
    it('should return created recipe', async () => {
      const res = await sendRequest(app, 'post', TEST_PATH, HttpStatus.CREATED, mockUser, undefined, mockRecipe);
      const recipe = <RecipeDto>res.body;
      expect(recipe).toBeDefined();
      expect(recipe.ownerId).toEqual(mockUser._id);
    });
    it(`should return ${HttpStatus.BAD_REQUEST} when title is incorrect`, async () => {
      const badRecipe = { ...mockRecipe, title: '' };
      await sendRequest(app, 'post', TEST_PATH, HttpStatus.BAD_REQUEST, mockUser, undefined, badRecipe);
    });
    it(`should return ${HttpStatus.BAD_REQUEST} when content is incorrect`, async () => {
      const badRecipe = { ...mockRecipe, content: 1234 };
      await sendRequest(app, 'post', TEST_PATH, HttpStatus.BAD_REQUEST, mockUser, undefined, badRecipe);
    });
    it(`should return ${HttpStatus.BAD_REQUEST} when imageUrl is not url`, async () => {
      const badRecipe = { ...mockRecipe, imageUrl: 'good looking food' };
      await sendRequest(app, 'post', TEST_PATH, HttpStatus.BAD_REQUEST, mockUser, undefined, badRecipe);
    });
  });
});
