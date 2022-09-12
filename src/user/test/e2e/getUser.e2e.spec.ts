import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

import { sendRequest } from '../../../../test/helpers/request';
import { MockGuards } from '../../../auth/guards/mock/guards';
import { UserDto } from '../../dto/user.dto';
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
    const request = (status: HttpStatus, user?: Partial<UserDto>) =>
      sendRequest(app, 'get', `/user/${mockUser._id}`, status, user);

    it(`should return ${HttpStatus.OK} and user information`, async () => {
      const res = await request(HttpStatus.OK, mockUser);
      expect(res.body._id).toEqual(mockUser._id);
    });

    it(`should return ${HttpStatus.FORBIDDEN} if user is not authenticated`, async () => {
      await request(HttpStatus.FORBIDDEN);
    });

    it(`should return ${HttpStatus.NOT_FOUND} when user does not exist`, async () => {
      mockUserService.getById.mockReturnValueOnce(null);
      await request(HttpStatus.NOT_FOUND, mockUser);
    });
  });
});
