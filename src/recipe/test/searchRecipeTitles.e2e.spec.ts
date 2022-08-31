import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { RecipeController } from '../recipe.controller';
import { RecipeService } from '../recipe.service';
import { mockRecipeService } from './mock/recipeService.mock';

describe('recipe', () => {
  let app: INestApplication;
  const recipeService = mockRecipeService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [
        {
          provide: RecipeService,
          useValue: recipeService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('/GET search/:query', () => {
    it('should return array of recipes containing query in their title', async () => {
      const res = await request(app.getHttpServer()).get('/recipe/search/somequery').expect(200);
      expect(res.body).not.toBeFalsy();
      expect(res.body[0].title).toBe('somequery');
    });

    it('should return empty array if no recipes are found', async () => {
      recipeService.searchInTitle.mockReturnValueOnce([]);
      const res = await request(app.getHttpServer()).get('/recipe/search/query').expect(200);
      expect(res.body).toBeDefined();
      expect(res.body).toStrictEqual([]);
    });
  });
});
