import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections, rootMongooseTestModule } from '../../mock/db.mock';
import { Recipe, RecipeDocument, RecipeSchema } from '../recipe.schema';
import { RecipeService } from '../recipe.service';
import { generateRecipes } from './mock/recipe.mock';

describe('RecipeService.getAll()', () => {
  let service: RecipeService;
  let recipeMock: Model<RecipeDocument>;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }])],
      providers: [RecipeService],
    }).compile();

    service = module.get(RecipeService);
    recipeMock = module.get(getModelToken(Recipe.name));
  });

  afterAll(async () => {
    await closeConnections();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated list of all recipes', async () => {
    await recipeMock.insertMany(generateRecipes(20));
    const defaultRecipes = await service.getAll();
    expect(defaultRecipes).toHaveLength(10);
    const allRecipes = await service.getAll({ limit: 20 });
    expect(allRecipes).toHaveLength(20);
    const [first] = await service.getAll({ page: 2, limit: 5 });
    expect(first).toEqual(allRecipes[5]);
  });

  it('should return empty array if no recipes are present', async () => {
    const recipes = await service.getAll({});
    expect(recipes).toStrictEqual([]);
  });
});
