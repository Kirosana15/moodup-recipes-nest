import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections, rootMongooseTestModule } from '../../mock/db.mock';
import { Recipe, RecipeSchema } from '../recipe.schema';
import { RecipeService } from '../recipe.service';
import { recipeMock } from './mock/recipe.mock';

describe('RecipeService.create()', () => {
  let service: RecipeService;
  let recipeModel: Model<RecipeService>;
  let saveSpy: jest.SpyInstance;
  let module: TestingModule;

  beforeAll(async () => {
    jest.clearAllMocks();
    module = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }])],
      providers: [RecipeService],
    }).compile();

    service = module.get(RecipeService);
    recipeModel = module.get(getModelToken(Recipe.name));
    saveSpy = jest.spyOn(recipeModel.prototype, 'save');
  });

  afterEach(async () => {
    await recipeModel.db.dropDatabase();
  });

  afterAll(async () => {
    await closeConnections();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return recipe', async () => {
    const title = 'test';
    const recipe = await service.create(recipeMock({ title }));
    expect(recipe.title).toBe(title);
    const recipeFromDb = await recipeModel.findOne({ ownerId: recipe.ownerId });
    expect(recipeFromDb?._id).toStrictEqual(recipe._id);
    expect(saveSpy).toBeCalledTimes(1);
  });
});
