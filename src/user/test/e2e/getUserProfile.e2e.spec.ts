import { ExecutionContext, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { UserInfoDto } from '../../dto/user.dto';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { generateUser } from '../mock/user.model.mock';
import { mockUserService } from '../mock/user.service.mock';

describe('user', () => {
  let app: NestApplication;
  let mockUser: UserInfoDto;
  let module: TestingModule;

  beforeAll(async () => {
    mockUser = generateUser();
    module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));
    app.useGlobalGuards({
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        if (req.headers['authorization'] !== 'token') {
          return false;
        }
        req.user = mockUser;
        return true;
      },
    });
    await app.init();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('/GET me', () => {
    it(`should return ${HttpStatus.OK} and user info`, async () => {
      const res = await request(app.getHttpServer())
        .get('/user/me')
        .set('authorization', 'token')
        .expect(HttpStatus.OK);
      expect(res.body).toEqual(mockUser);
    });

    it(`should return ${HttpStatus.FORBIDDEN} when user is not logged in`, async () => {
      await request(app.getHttpServer()).get('/user/me').expect(HttpStatus.FORBIDDEN);
    });
  });
});
