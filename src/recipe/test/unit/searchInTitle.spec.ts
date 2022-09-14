import { getModelToken } from '@nestjs/mongoose';
import { TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections } from '../../../../test/mock/db.mock';
import { Recipe, RecipeDocument } from '../../recipe.schema';
import { RecipeService } from '../../recipe.service';
import { mockPaginationQuery, recipeMock } from '../mock/recipe.mock';
import { setupModule } from './setup';

describe('RecipeService.searchInTitle()', () => {
  let recipeService: RecipeService;
  let recipeModel: Model<RecipeDocument>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await setupModule();

    recipeService = module.get(RecipeService);
    recipeModel = module.get(getModelToken(Recipe.name));
  });

  afterEach(async () => {
    await recipeModel.db.dropDatabase();
  });

  afterAll(async () => {
    await closeConnections();
    await module.close();
  });

  it('should fetch recipes from database', async () => {
    const newRecipe = await new recipeModel(recipeMock()).save();
    const [recipe] = (await recipeService.searchInTitle(newRecipe.title, mockPaginationQuery())).items;
    expect(recipe).toBeDefined();
    expect(recipe.title).toBe(newRecipe.title);
    expect(recipe.imageUrl).toBe(newRecipe.imageUrl);
    expect(recipe.content).toBe(newRecipe.content);
  });

  it('should find recipes with titles containing a query', async () => {
    const newRecipe = await new recipeModel(recipeMock()).save();
    const partTitle = newRecipe.title.slice(0, 3);
    const { items: foundRecipes } = await recipeService.searchInTitle(partTitle, mockPaginationQuery());
    expect(foundRecipes[0]._id).toStrictEqual(newRecipe._id);
  });

  describe('should not return recipe when', () => {
    it('query does not match any existing title', async () => {
      expect((await recipeService.searchInTitle(recipeMock().title, mockPaginationQuery())).items).toHaveLength(0);
    });

    it('no title was provided', async () => {
      const title = '';
      expect((await recipeService.searchInTitle(title, mockPaginationQuery())).items).toHaveLength(0);
    });
  });
});
