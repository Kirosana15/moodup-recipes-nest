import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

import { sendRequest } from '../../../../test/helpers/request';
import { RoleTypes } from '../../../auth/enums/roles';
import { MockGuards } from '../../../auth/guards/mock/guards';
import { UserInfoDto } from '../../dto/user.dto';
import { UserService } from '../../user.service';
import { generateUserFromDb } from '../mock/user.model.mock';
import { setupApp, setupModule } from './setup';

describe('POST /login', () => {
  let service: UserService;
  let app: NestApplication;
  let getAllSpy: jest.SpyInstance;
  let module: TestingModule;
  const mockUser = generateUserFromDb({ roles: [RoleTypes.User, RoleTypes.Admin] });

  beforeAll(async () => {
    module = await setupModule();
    app = await setupApp(module, MockGuards.AdminOnly);

    service = module.get(UserService);

    getAllSpy = jest.spyOn(service, 'getAll');
  });

  afterAll(async () => {
    await module.close();
  });

  describe('GET /user/all/', () => {
    const TEST_PATH = '/user/all';

    it(`should return ${HttpStatus.OK} and a list of all users`, async () => {
      const res = await sendRequest(app, 'get', TEST_PATH, HttpStatus.OK, mockUser);
      const users = res.body;
      expect(users).toHaveLength(10);
      users.forEach((user: UserInfoDto) => {
        expect(user._id).toBeDefined();
      });
      expect(getAllSpy).toBeCalledTimes(1);
    });

    it(`should return ${HttpStatus.FORBIDDEN} when user is not an admin`, async () => {
      await sendRequest(app, 'get', TEST_PATH, HttpStatus.FORBIDDEN, { ...mockUser, roles: [RoleTypes.User] });
    });

    it(`should return ${HttpStatus.OK} and page $page of users`, async () => {
      const res = await sendRequest(app, 'get', TEST_PATH, HttpStatus.OK, mockUser, { page: 2 });
      const users = res.body;
      expect(users).toHaveLength(10);
    });

    it(`should return ${HttpStatus.OK} and $limit amount of users`, async () => {
      const res = await sendRequest(app, 'get', TEST_PATH, HttpStatus.OK, mockUser, { limit: 20 });
      const users = res.body;
      expect(users).toHaveLength(20);
    });

    it(`should return ${HttpStatus.BAD_REQUEST} when page is not a number`, async () => {
      const res = await sendRequest(app, 'get', TEST_PATH, HttpStatus.BAD_REQUEST, mockUser, { page: 'two' });
      expect(res.body.message[0]).toMatch('page must be a number');
    });

    it(`should return ${HttpStatus.BAD_REQUEST} when limit is not a number`, async () => {
      const res = await sendRequest(app, 'get', TEST_PATH, HttpStatus.BAD_REQUEST, mockUser, { limit: 'two' });
      expect(res.body.message[0]).toMatch('limit must be a number');
    });
  });
});
