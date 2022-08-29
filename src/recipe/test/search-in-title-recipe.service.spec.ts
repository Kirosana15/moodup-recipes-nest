import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections, rootMongooseTestModule } from '../../mock/db.mock';
import { Recipe, RecipeDocument, RecipeSchema } from '../recipe.schema';
import { RecipeService } from '../recipe.service';
import { recipeMock } from './mock/recipe.mock';

describe('RecipeService.searchInTitle()', () => {
  let recipeService: RecipeService;
  let recipeModel: Model<RecipeDocument>;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }])],
      providers: [RecipeService],
    }).compile();

    recipeService = module.get(RecipeService);
    recipeModel = module.get(getModelToken(Recipe.name));
  });

  afterAll(async () => {
    await closeConnections();
  });
  it('should fetch recipes from database', async () => {
    const newRecipe = await new recipeModel(recipeMock()).save();
    const [recipe] = await recipeService.searchInTitle(newRecipe.title);
    expect(recipe).toBeDefined();
    expect(recipe.title).toBe(newRecipe.title);
    expect(recipe.imageUrl).toBe(newRecipe.imageUrl);
    expect(recipe.content).toBe(newRecipe.content);
  });

  it('should find recipes with titles containing a query', async () => {
    const newRecipe = await new recipeModel(recipeMock()).save();
    const partTitle = newRecipe.title.slice(0, 3);
    const foundRecipes = await recipeService.searchInTitle(partTitle);
    expect(foundRecipes[0]._id).toStrictEqual(newRecipe._id);
  });

  describe('should not return recipe when', () => {
    it('query does not match any existing title', async () => {
      expect(await recipeService.searchInTitle(recipeMock().title)).toHaveLength(0);
    });

    it('no title provided', async () => {
      const title = '';
      expect(await recipeService.searchInTitle(title)).toHaveLength(0);
    });
  });
});
