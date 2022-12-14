import { ExecutionContext, HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { OwnerGuard } from '../../auth/guards/owner.guard';
import { rootMongooseTestModule } from '../../mock/db.mock';
import { generateUserFromDb } from '../../user/test/mock/user.model.mock';
import { RecipeModule } from '../recipe.module';
import { RecipeService } from '../recipe.service';
import { mockId, recipeMock } from '../test/mock/recipe.mock';
import { mockRecipeService } from '../test/mock/recipeService.mock';

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
      .overrideGuard(OwnerGuard)
      .useValue({
        canActivate(context: ExecutionContext) {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;
          const { _id: id } = req.params;
          return id === mockUser._id;
        },
      })
      .compile();

    app = module.createNestApplication();
    await app.init();

    recipeService.getById.mockImplementation((id: string) => recipeMock({ _id: id, ownerId: mockUser._id }));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/DELETE :id', () => {
    it('should return deleted recipe', async () => {
      const idMock = mockUser._id;
      const res = await request(app.getHttpServer()).delete(`/recipe/${idMock}`).expect(HttpStatus.OK);
      expect(res.body).toBeDefined();
      expect(res.body._id).toEqual(idMock);
    });
    it(`should return ${HttpStatus.NOT_FOUND} if recipe does not exist`, async () => {
      const idMock = mockUser._id;
      recipeService.delete.mockReturnValueOnce(null);
      await request(app.getHttpServer()).delete(`/recipe/${idMock}`).expect(HttpStatus.NOT_FOUND);
    });
    it(`should return ${HttpStatus.FORBIDDEN} if user is not an owner of a recipe`, async () => {
      const idMock = mockId();
      await request(app.getHttpServer()).delete(`/recipe/${idMock}`).expect(HttpStatus.FORBIDDEN);
    });
  });
});
