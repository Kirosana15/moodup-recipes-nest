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
    const testPath = (query: string) => `/recipe/search/${query}`;
    it('should return array of recipes containing query in their title', async () => {
      const query = faker.word.noun();
      const res = await sendRequest(app, 'get', testPath(query), HttpStatus.OK);
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
      const res = await sendRequest(app, 'get', testPath('query'), HttpStatus.OK);
      expect(res.body).toBeDefined();
      expect(res.body).toStrictEqual([]);
    });
  });
});
