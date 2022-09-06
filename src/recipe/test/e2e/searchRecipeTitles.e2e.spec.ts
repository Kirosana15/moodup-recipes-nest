import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { PaginatedResults } from '../../../dto/paginatedResults.dto';
import { RecipeInfoDto } from '../../dto/recipe.dto';
import { RecipeController } from '../../recipe.controller';
import { RecipeService } from '../../recipe.service';
import { mockRecipeService } from '../mock/recipeService.mock';

describe('recipe', () => {
  let app: INestApplication;
  const recipeService = mockRecipeService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [
        {
          provide: RecipeService,
          useValue: recipeService,
        },
      ],
    }).compile();

    afterAll(async () => {
      await app.close();
    });

    app = module.createNestApplication();
    await app.init();
  });

  describe('/GET search/:query', () => {
    it('should return array of recipes containing query in their title', async () => {
      const res = await request(app.getHttpServer()).get('/recipe/search/somequery').expect(HttpStatus.OK);
      const { pagination, items }: PaginatedResults<RecipeInfoDto> = res.body;
      expect(items[0].title).toBe('somequery');
      expect(items).toHaveLength(10);
      expect(pagination.page).toEqual(1);
      expect(pagination.pageSize).toEqual(10);
      expect(pagination.totalItems).toEqual(15);
      expect(pagination.totalPages).toEqual(2);
      expect(pagination.hasNext).toBeTruthy();
      expect(pagination.hasPrevious).toBeFalsy();
    });

    it('should return empty array if no recipes are found', async () => {
      recipeService.searchInTitle.mockReturnValueOnce([]);
      const res = await request(app.getHttpServer()).get('/recipe/search/query').expect(HttpStatus.OK);
      expect(res.body).toBeDefined();
      expect(res.body).toStrictEqual([]);
    });
  });
});
