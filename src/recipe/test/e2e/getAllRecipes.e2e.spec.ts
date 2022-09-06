import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { RoleTypes } from '../../../auth/enums/roles';
import { PaginatedResults } from '../../../dto/paginatedResults.dto';
import { rootMongooseTestModule } from '../../../mock/db.mock';
import { generateUserFromDb } from '../../../user/test/mock/user.model.mock';
import { RecipeInfoDto } from '../../dto/recipe.dto';
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
      const { pagination, items }: PaginatedResults<RecipeInfoDto> = res.body;
      expect(items).toHaveLength(10);
      expect(pagination.page).toEqual(1);
      expect(pagination.pageSize).toEqual(10);
      expect(pagination.totalItems).toEqual(15);
      expect(pagination.totalPages).toEqual(2);
      expect(pagination.hasNext).toBeTruthy();
      expect(pagination.hasPrevious).toBeFalsy();
    });

    it(`should return ${HttpStatus.BAD_REQUEST} when page is not a number`, async () => {
      await request(app.getHttpServer()).get('/recipe/all?page=page').expect(HttpStatus.BAD_REQUEST);
    });

    it(`should return ${HttpStatus.BAD_REQUEST} when limit is not a number`, async () => {
      await request(app.getHttpServer()).get('/recipe/all?limit=limit').expect(HttpStatus.BAD_REQUEST);
    });

    it('should return paginated list', async () => {
      const res = await request(app.getHttpServer()).get('/recipe/all?limit=5').expect(HttpStatus.OK);
      const { pagination, items }: PaginatedResults<RecipeInfoDto> = res.body;
      expect(items).toBeDefined();
      expect(items).toHaveLength(5);
      expect(pagination.pageSize).toEqual(5);
      expect(pagination.totalPages).toEqual(2);
    });
  });
});
