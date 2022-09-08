import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { generateUser } from '../mock/user.model.mock';
import { mockUserService } from '../mock/user.service.mock';
import { MockGuards, setupApp, setupModule } from './setup';

describe('user', () => {
  let app: NestApplication;
  let module: TestingModule;
  const mockUser = generateUser();

  beforeAll(async () => {
    module = await setupModule();
    app = await setupApp(module, MockGuards.Simple);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('/GET :id', () => {
    const TEST_PATH = '/user/';

    it(`should return ${HttpStatus.OK} and user information`, async () => {
      const res = await request(app.getHttpServer())
        .get(`${TEST_PATH}${mockUser._id}`)
        .set('Authorization', JSON.stringify(mockUser))
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
        .set('Authorization', JSON.stringify(mockUser))
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
