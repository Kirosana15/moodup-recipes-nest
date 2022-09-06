import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections, rootMongooseTestModule } from '../../mock/db.mock';
import { Recipe, RecipeDocument, RecipeSchema } from '../recipe.schema';
import { RecipeService } from '../recipe.service';
import { mockId, recipeMock } from './mock/recipe.mock';

describe('RecipeService.delete()', () => {
  let recipeService: RecipeService;
  let recipeModel: Model<RecipeDocument>;
  let module: TestingModule;

  beforeAll(async () => {
    jest.clearAllMocks();
    module = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }])],
      providers: [RecipeService],
    }).compile();

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

  it('should delete recipe from database', async () => {
    const recipe = new recipeModel(recipeMock());
    await recipe.save();
    const deletedRecipe = await recipeService.delete(recipe._id);
    expect(deletedRecipe).toBeDefined();
    const returnedRecipe = await recipeModel.findById(recipe._id);
    expect(returnedRecipe).toBeNull();
  });

  it('should return null when recipe does not exist', async () => {
    const recipe = await recipeService.delete(mockId());
    expect(recipe).toBeNull();
  });
});
