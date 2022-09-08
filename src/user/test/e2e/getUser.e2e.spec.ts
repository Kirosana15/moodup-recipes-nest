import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

import { sendRequest } from '../../../../test/helpers/request';
import { MockGuards } from '../../../auth/guards/mock/guards';
import { generateUser } from '../mock/user.model.mock';
import { mockUserService } from '../mock/user.service.mock';
import { setupApp, setupModule } from './setup';

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
    const TEST_PATH = `/user/${mockUser._id}`;

    it(`should return ${HttpStatus.OK} and user information`, async () => {
      const res = await sendRequest(app, 'get', TEST_PATH, HttpStatus.OK, mockUser);
      expect(res.body._id).toEqual(mockUser._id);
    });

    it(`should return ${HttpStatus.FORBIDDEN} if user is not authenticated`, async () => {
      await sendRequest(app, 'get', TEST_PATH, HttpStatus.FORBIDDEN);
    });

    it(`should return ${HttpStatus.NOT_FOUND} when user does not exist`, async () => {
      mockUserService.getById.mockReturnValueOnce(null);
      await sendRequest(app, 'get', TEST_PATH, HttpStatus.NOT_FOUND, mockUser);
    });
  });
});
