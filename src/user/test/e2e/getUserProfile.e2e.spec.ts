import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { createApp } from '../../../../test/e2e.setup';
import { createModule } from '../../../../test/test.setup';
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

    module = await createModule({
      providers: [UserService],
      controllers: [UserController],
      providerOverrides: [{ provider: UserService, mock: mockUserService }],
    });

    const guardMock = {
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        if (req.headers['authorization'] !== 'token') {
          return false;
        }
        req.user = mockUser;
        return true;
      },
    };

    app = await createApp(module, { globalGuards: [guardMock] });
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
