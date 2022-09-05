import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { RoleTypes } from '../../../auth/enums/roles';
import { rootMongooseTestModule } from '../../../mock/db.mock';
import { generateUserFromDb } from '../../../user/test/mock/user.model.mock';
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
    app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));
    app.useGlobalGuards({
      canActivate(context) {
        const req = context.switchToHttp().getRequest();
        req.user = mockUser;
        return mockUser.roles.includes(RoleTypes.Admin);
      },
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  describe('/GET all', () => {
    it('should require user to be an admin', async () => {
      await request(app.getHttpServer()).get('/recipe/all').expect(HttpStatus.FORBIDDEN);
    });
    it('should return list of all recipes', async () => {
      mockUser.roles.push(RoleTypes.Admin);
      const res = await request(app.getHttpServer()).get('/recipe/all').expect(HttpStatus.OK);
      expect(res.body).toBeDefined();
      expect(res.body).toHaveLength(10);
    });
    it('should return paginated list', async () => {
      mockUser.roles.push(RoleTypes.Admin);
      const res = await request(app.getHttpServer()).get('/recipe/all?limit=5').expect(HttpStatus.OK);
      expect(res.body).toBeDefined();
      expect(res.body).toHaveLength(5);
    });
  });
});
