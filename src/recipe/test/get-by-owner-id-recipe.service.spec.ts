import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { rootMongooseTestModule } from '../../mock/db.mock';
import { generateMockId, mockId } from '../../user/test/mock/user.model.mock';
import { Recipe, RecipeDocument, RecipeSchema } from '../recipe.schema';
import { RecipeService } from '../recipe.service';
import { generateRecipes } from './mock/recipe.mock';

describe('RecipeService.getByOwnerId()', () => {
  let recipeService: RecipeService;
  let recipeMock: Model<RecipeDocument>;
  let findSpy: jest.SpyInstance;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }])],
      providers: [RecipeService],
    }).compile();

    recipeService = module.get(RecipeService);
    recipeMock = module.get(getModelToken(Recipe.name));
    findSpy = jest.spyOn(recipeMock, 'find');
  });

  it('should return list of recipes owned by user', async () => {
    const recipeDocuments = generateRecipes(5, { ownerId: mockId });
    await recipeMock.insertMany(recipeDocuments);
    const recipes = await recipeService.getByOwnerId(mockId);
    expect(recipes.every(recipe => recipe.ownerId === mockId)).toBeTruthy();
    expect(recipes).toHaveLength(5);
    expect(findSpy).toBeCalledTimes(1);
  });

  it('should return empty array when user has no recipes', async () => {
    const recipeDocuments = generateRecipes(5, { ownerId: mockId });
    await recipeMock.insertMany(recipeDocuments);
    const recipes = await recipeService.getByOwnerId(generateMockId());
    expect(recipes).toHaveLength(0);
    expect(findSpy).toBeCalledTimes(1);
  });
});
