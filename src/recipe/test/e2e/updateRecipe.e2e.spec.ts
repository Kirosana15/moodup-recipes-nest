import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

import { sendRequest } from '../../../../test/helpers/request';
import { MockGuards, getMockGuard } from '../../../auth/guards/mock/guards';
import { OwnerGuard } from '../../../auth/guards/owner.guard';
import { generateUserFromDb } from '../../../user/test/mock/user.model.mock';
import { RecipeDto } from '../../dto/recipe.dto';
import { mockId, mockTitle } from '../mock/recipe.mock';
import { mockRecipeService } from '../mock/recipeService.mock';
import { setupApp, setupModule } from './setup';

describe('recipe', () => {
  let app: NestApplication;
  const recipeService = mockRecipeService;
  const mockUser = generateUserFromDb();
  let module: TestingModule;

  beforeAll(async () => {
    module = await setupModule({ guardOverrides: [{ guard: OwnerGuard, mock: getMockGuard(MockGuards.Owner) }] });
    app = await setupApp(module);
  });

  afterAll(async () => {
    await module.close();
    await app.close();
  });

  describe('/PATCH :id', () => {
    const request = (status: HttpStatus, body?: Partial<RecipeDto>, path = `/recipe/${mockUser._id}`) =>
      sendRequest(app, 'patch', path, status, mockUser, undefined, body);

    it('should return updated recipe', async () => {
      const titleMock = mockTitle();
      const res = await request(HttpStatus.OK, { title: titleMock });
      expect(res.body).toBeDefined();
      expect(res.body._id).toBe(mockUser._id);
      expect(res.body.title).toBe(titleMock);
    });

    it(`should return ${HttpStatus.NOT_FOUND} when recipe does not exist`, async () => {
      recipeService.update.mockReturnValueOnce(null);
      await request(HttpStatus.NOT_FOUND);
    });

    it(`should return ${HttpStatus.FORBIDDEN} when user is not authorized to update recipe`, async () => {
      const idMock = mockId();
      await request(HttpStatus.FORBIDDEN, undefined, `/recipe/${idMock}`);
    });
  });
});
