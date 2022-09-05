import { ExecutionContext, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { rootMongooseTestModule } from '../../../mock/db.mock';
import { generateUserFromDb } from '../../../user/test/mock/user.model.mock';
import { RecipeDto } from '../../dto/recipe.dto';
import { RecipeModule } from '../../recipe.module';
import { RecipeService } from '../../recipe.service';
import { recipeMock } from '../mock/recipe.mock';
import { mockRecipeService } from '../mock/recipeService.mock';

describe('recipe', () => {
  let app: INestApplication;
  const recipeService = mockRecipeService;
  const mockUser = generateUserFromDb();
  const mockRecipe = recipeMock();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), RecipeModule],
    })
      .overrideProvider(RecipeService)
      .useValue(recipeService)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));
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
  describe('/POST', () => {
    it('should return created recipe', async () => {
      const res = await request(app.getHttpServer()).post('/recipe').send(mockRecipe).expect(HttpStatus.CREATED);
      const recipe = <RecipeDto>res.body;
      expect(recipe).toBeDefined();
      expect(recipe.ownerId).toEqual(mockUser._id);
    });
    it(`should return ${HttpStatus.BAD_REQUEST} when title is incorrect`, async () => {
      const badRecipe = { ...mockRecipe, title: '' };
      await request(app.getHttpServer()).post('/recipe').send(badRecipe).expect(HttpStatus.BAD_REQUEST);
    });
    it(`should return ${HttpStatus.BAD_REQUEST} when content is incorrect`, async () => {
      const badRecipe = { ...mockRecipe, content: 1234 };
      await request(app.getHttpServer()).post('/recipe').send(badRecipe).expect(HttpStatus.BAD_REQUEST);
    });
    it(`should return ${HttpStatus.BAD_REQUEST} when imageUrl is not url`, async () => {
      const badRecipe = { ...mockRecipe, imageUrl: 'good looking food' };
      await request(app.getHttpServer()).post('/recipe').send(badRecipe).expect(HttpStatus.BAD_REQUEST);
    });
  });
});
