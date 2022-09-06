import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { closeConnections, rootMongooseTestModule } from '../../mock/db.mock';
import { Recipe, RecipeDocument, RecipeSchema } from '../recipe.schema';
import { RecipeService } from '../recipe.service';
import { mockId, recipeMock } from './mock/recipe.mock';

describe('RecipeService.getById()', () => {
  let service: RecipeService;
  let recipeModel: Model<RecipeDocument>;
  let findByIdSpy: jest.SpyInstance;
  let module: TestingModule;

  beforeAll(async () => {
    jest.clearAllMocks();
    module = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }])],
      providers: [RecipeService],
    }).compile();

    service = module.get(RecipeService);
    recipeModel = module.get(getModelToken(Recipe.name));
    findByIdSpy = jest.spyOn(recipeModel, 'findById');
  });

  afterEach(async () => {
    await recipeModel.db.dropDatabase();
  });

  afterAll(async () => {
    await closeConnections();
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return recipe', async () => {
    const idMock = mockId();
    findByIdSpy.mockReturnValue({ lean: () => ({ exec: () => recipeMock({ _id: idMock }) }) });
    const recipe = await service.getById(idMock);
    expect(recipe).toBeDefined();
    expect(recipe?._id).toBe(idMock);
    expect(findByIdSpy).toBeCalledTimes(1);
  });

  it('should return null when recipe of specified id does not exist', async () => {
    findByIdSpy.mockReturnValueOnce({ lean: () => ({ exec: () => null }) });
    const recipe = await service.getById(mockId());
    expect(recipe).toBeNull();
  });
});
