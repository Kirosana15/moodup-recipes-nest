import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

import { sendRequest } from '../../../../test/helpers/request';
import { generateUser } from '../mock/user.model.mock';
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

  describe('/GET me', () => {
    const TEST_PATH = '/user/me';
    it(`should return ${HttpStatus.OK} and user info`, async () => {
      const res = await sendRequest(app, 'get', TEST_PATH, HttpStatus.OK, mockUser);
      expect(res.body).toEqual(mockUser);
    });

    it(`should return ${HttpStatus.FORBIDDEN} when user is not logged in`, async () => {
      await sendRequest(app, 'get', TEST_PATH, HttpStatus.FORBIDDEN);
    });
  });
});
