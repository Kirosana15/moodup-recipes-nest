import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

import { sendRequest } from '../../../../test/helpers/request';
import { RoleTypes } from '../../../auth/enums/roles';
import { MockGuards } from '../../../auth/guards/mock/guards';
import { UserDto } from '../../dto/user.dto';
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
    const request = (status: HttpStatus, user?: Partial<UserDto>, path = `/user/${mockUser._id}`) =>
      sendRequest(app, 'get', path, status, user);
    it(`should return ${HttpStatus.OK} and deleted user`, async () => {
      const res = await request(HttpStatus.OK, mockUser);
      expect(res.body._id).toEqual(mockUser._id);
    });
    it(`should return ${HttpStatus.NOT_FOUND} when user does not exist`, async () => {
      mockUserService.delete.mockReturnValueOnce(null);
      await request(HttpStatus.NOT_FOUND, mockUser);
    });
    it(`should return ${HttpStatus.FORBIDDEN} when user tries to delete another user`, async () => {
      mockUserService.delete.mockReturnValueOnce(null);
      await request(HttpStatus.FORBIDDEN, mockUser, `/user/${mockId}`);
    });
  });
});
