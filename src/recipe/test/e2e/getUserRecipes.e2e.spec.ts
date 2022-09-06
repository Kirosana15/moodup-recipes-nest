import { ExecutionContext, HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { rootMongooseTestModule } from '../../../mock/db.mock';
import { generateUserFromDb } from '../../../user/test/mock/user.model.mock';
import { RecipeDto } from '../../dto/recipe.dto';
import { RecipeModule } from '../../recipe.module';
import { RecipeService } from '../../recipe.service';
import { mockRecipeService } from '../mock/recipeService.mock';

describe('recipe', () => {
  let app: INestApplication;
  const recipeService = mockRecipeService;
  const mockUser = generateUserFromDb();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), RecipeModule],
    })
      .overrideProvider(RecipeService)
      .useValue(recipeService)
      .compile();

    app = module.createNestApplication();
    app.useGlobalGuards({
      canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        req.user = mockUser;
        return true;
      },
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/GET recipe', () => {
    it('should return a list of recipes', async () => {
      const res = await request(app.getHttpServer()).get(`/recipe`).expect(HttpStatus.OK);
      const recipes: RecipeDto[] = res.body;
      expect(recipes).toHaveLength(5);
      expect(recipes.every(recipe => recipe.ownerId === mockUser._id));
    });
    it('should return empty array if user has no recipes', async () => {
      recipeService.getByOwnerId.mockReturnValueOnce([]);
      const res = await request(app.getHttpServer()).get(`/recipe`).expect(HttpStatus.OK);
      const recipes: RecipeDto[] = res.body;
      expect(recipes).toHaveLength(0);
    });
  });
});
