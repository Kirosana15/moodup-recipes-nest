import { ExecutionContext, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { BearerAuthGuard } from '../../../auth/strategies/bearer.strategy';
import { rootMongooseTestModule } from '../../../mock/db.mock';
import { generateUserFromDb } from '../../../user/test/mock/user.model.mock';
import { RecipeModule } from '../../recipe.module';
import { RecipeService } from '../../recipe.service';
import { mockId, mockTitle } from '../mock/recipe.mock';
import { mockRecipeService } from '../mock/recipeService.mock';

describe('recipe', () => {
  let app: INestApplication;
  const recipeService = mockRecipeService;
  const mockUser = generateUserFromDb();
  let bearerGuardMock: BearerAuthGuard;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), RecipeModule],
    })
      .overrideProvider(RecipeService)
      .useValue(recipeService)
      .overrideGuard(BearerAuthGuard)
      .useValue({
        canActivate(context: ExecutionContext) {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;
          return true;
        },
      })
      .compile();

    bearerGuardMock = module.get(BearerAuthGuard);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  describe('/PATCH :id', () => {
    it('should return updated recipe', async () => {
      const idMock = mockId();
      const titleMock = mockTitle();
      const res = await request(app.getHttpServer())
        .patch(`/recipe/${idMock}`)
        .send({ title: titleMock })
        .expect(HttpStatus.OK);
      expect(res.body).toBeDefined();
      expect(res.body._id).toBe(idMock);
      expect(res.body.title).toBe(titleMock);
    });

    it(`should return ${HttpStatus.NOT_FOUND} when recipe does not exist`, async () => {
      const idMock = mockId();
      recipeService.getById.mockReturnValueOnce(null);
      await request(app.getHttpServer()).patch(`/recipe/${idMock}`).expect(HttpStatus.NOT_FOUND);
    });

    it(`should return ${HttpStatus.FORBIDDEN} when user is not authorized to update recipe`, async () => {
      const idMock = mockId();
      bearerGuardMock.canActivate = () => {
        return false;
      };
      await request(app.getHttpServer()).patch(`/recipe/${idMock}`).expect(HttpStatus.FORBIDDEN);
    });
  });
});
