import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

import { sendRequest } from '../../../../test/helpers/request';
import { RoleTypes } from '../../../auth/enums/roles';
import { MockGuards } from '../../../auth/guards/mock/guards';
import { generateUserFromDb, mockId } from '../mock/user.model.mock';
import { mockUserService } from '../mock/user.service.mock';
import { setupApp, setupModule } from './setup';

describe('user', () => {
  let app: NestApplication;
  let module: TestingModule;
  const mockUser = generateUserFromDb({ roles: [RoleTypes.User] });

  beforeAll(async () => {
    module = await setupModule();
    app = await setupApp(module, MockGuards.Owner);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('/DELETE :id', () => {
    const TEST_PATH = `/user/${mockUser._id}`;
    it(`should return ${HttpStatus.OK} and deleted user`, async () => {
      const res = await sendRequest(app, 'delete', TEST_PATH, HttpStatus.OK, mockUser);
      expect(res.body._id).toEqual(mockUser._id);
    });
    it(`should return ${HttpStatus.NOT_FOUND} when user does not exist`, async () => {
      mockUserService.delete.mockReturnValueOnce(null);
      await sendRequest(app, 'delete', TEST_PATH, HttpStatus.NOT_FOUND, mockUser);
    });
    it(`should return ${HttpStatus.FORBIDDEN} when user tries to delete another user`, async () => {
      mockUserService.delete.mockReturnValueOnce(null);
      await sendRequest(app, 'delete', `/user/${mockId}`, HttpStatus.FORBIDDEN, mockUser);
    });
  });
});
