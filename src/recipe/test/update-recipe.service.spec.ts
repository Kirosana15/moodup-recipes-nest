import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections, rootMongooseTestModule } from '../../mock/db.mock';
import { Recipe, RecipeDocument, RecipeSchema } from '../recipe.schema';
import { RecipeService } from '../recipe.service';
import { mockId, recipeMock } from './mock/recipe.mock';

describe('RecipeService.update()', () => {
  let recipeService: RecipeService;
  let recipeModel: Model<RecipeDocument>;
  let recipe: RecipeDocument;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }])],
      providers: [RecipeService],
    }).compile();

    recipeService = module.get(RecipeService);
    recipeModel = module.get(getModelToken(Recipe.name));
    recipe = new recipeModel(recipeMock());
    await recipe.save();
  });

  afterAll(async () => {
    await closeConnections();
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
