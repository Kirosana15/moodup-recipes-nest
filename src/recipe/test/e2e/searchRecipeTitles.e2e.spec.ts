import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

import { sendRequest } from '../../../../test/helpers/request';
import { PaginatedResults } from '../../../dto/paginatedResults.dto';
import { RecipeInfoDto } from '../../dto/recipe.dto';
import { mockRecipeService } from '../mock/recipeService.mock';
import { setupApp, setupModule } from './setup';

describe('recipe', () => {
  let app: NestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await setupModule();
    app = await setupApp(module);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('/GET search/:query', () => {
    const request = (status: HttpStatus, query: string) => sendRequest(app, 'get', `/recipe/search/${query}`, status);
    it('should return array of recipes containing query in their title', async () => {
      const query = faker.word.noun();
      const res = await request(HttpStatus.OK, query);
      const { pagination, items }: PaginatedResults<RecipeInfoDto> = res.body;
      expect(items.every(recipe => recipe.title === query)).toBeTruthy();
      expect(items).toHaveLength(10);
      expect(pagination.page).toEqual(1);
      expect(pagination.pageSize).toEqual(10);
      expect(pagination.totalItems).toEqual(15);
      expect(pagination.totalPages).toEqual(2);
      expect(pagination.hasNext).toBeTruthy();
      expect(pagination.hasPrevious).toBeFalsy();
    });

    it('should return empty array if no recipes are found', async () => {
      mockRecipeService.searchInTitle.mockReturnValueOnce([]);
      const res = await request(HttpStatus.OK, 'query');
      expect(res.body).toBeDefined();
      expect(res.body).toStrictEqual([]);
    });
  });
});
