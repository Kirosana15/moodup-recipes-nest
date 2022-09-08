import { getModelToken } from '@nestjs/mongoose';
import { TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections } from '../../../../test/mock/db.mock';
import { Recipe, RecipeDocument } from '../../recipe.schema';
import { RecipeService } from '../../recipe.service';
import { mockId, recipeMock } from '../mock/recipe.mock';
import { setupModule } from './setup';

describe('RecipeService.update()', () => {
  let recipeService: RecipeService;
  let recipeModel: Model<RecipeDocument>;
  let recipe: RecipeDocument;
  let module: TestingModule;

  beforeAll(async () => {
    module = await setupModule();

    recipeService = module.get(RecipeService);
    recipeModel = module.get(getModelToken(Recipe.name));
  });

  beforeEach(async () => {
    recipe = new recipeModel(recipeMock());
    await recipe.save();
  });

  afterEach(async () => {
    await recipeModel.db.dropDatabase();
  });

  afterAll(async () => {
    await closeConnections();
    await module.close();
  });

  it('should update recipe in database', async () => {
    await recipeService.update(recipe._id, { title: 'test' });
    const recipeFromDb = await recipeModel.findById(recipe._id);
    expect(recipeFromDb?.title).toEqual('test');
  });

  it('should return updated recipe', async () => {
    const updatedRecipe = await recipeService.update(recipe._id, { title: 'test' });
    expect(updatedRecipe?.title).toEqual('test');
  });

  it('should return null when recipe does not exist', async () => {
    const updatedRecipe = await recipeService.update(mockId(), { title: 'test' });
    expect(updatedRecipe).toBeNull();
  });
});
