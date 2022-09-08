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
      canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        if (!req.headers['authorization']) {
          return false;
        }
        return true;
      },
    };

    app = await createApp(module, { globalGuards: [guardMock] });
  });

  afterAll(async () => {
    await module.close();
  });

  describe('/GET :id', () => {
    const TEST_PATH = '/user/';

    it(`should return ${HttpStatus.OK} and user information`, async () => {
      const res = await request(app.getHttpServer())
        .get(`${TEST_PATH}${mockUser._id}`)
        .set('Authorization', 'token')
        .expect(HttpStatus.OK);
      expect(res.body._id).toEqual(mockUser._id);
    });

    it(`should return ${HttpStatus.FORBIDDEN} if user is not authenticated`, async () => {
      await request(app.getHttpServer()).get(`${TEST_PATH}${mockUser._id}`).expect(HttpStatus.FORBIDDEN);
    });

    it(`should return ${HttpStatus.NOT_FOUND} when user does not exist`, async () => {
      mockUserService.getById.mockReturnValueOnce(null);
      await request(app.getHttpServer())
        .get(`${TEST_PATH}${mockUser._id}`)
        .set('Authorization', 'token')
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
