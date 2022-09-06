import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections, rootMongooseTestModule } from '../../mock/db.mock';
import { Recipe, RecipeDocument, RecipeSchema } from '../recipe.schema';
import { RecipeService } from '../recipe.service';
import { generateRecipes, mockPaginationQuery } from './mock/recipe.mock';

describe('RecipeService.getAll()', () => {
  let service: RecipeService;
  let recipeModel: Model<RecipeDocument>;
  let module: TestingModule;

  beforeAll(async () => {
    jest.clearAllMocks();
    module = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }])],
      providers: [RecipeService],
    }).compile();

    service = module.get(RecipeService);
    recipeModel = module.get(getModelToken(Recipe.name));
  });

  afterEach(async () => {
    await recipeModel.db.dropDatabase();
  });

  afterAll(async () => {
    await closeConnections();
    await module.close();
  });

  it('should return empty array if no recipes are present', async () => {
    const { items } = await service.getAll(mockPaginationQuery());
    expect(items).toStrictEqual([]);
  });

  it('should return paginated list of all recipes', async () => {
    await recipeModel.insertMany(generateRecipes(20));
    const { items: defaultRecipes } = await service.getAll(mockPaginationQuery());
    expect(defaultRecipes).toHaveLength(10);
    const { items: allRecipes } = await service.getAll(mockPaginationQuery(1, 20));
    expect(allRecipes).toHaveLength(20);
    const [first] = (await service.getAll(mockPaginationQuery(2, 5))).items;
    expect(first).toEqual(allRecipes[5]);
  });
});
