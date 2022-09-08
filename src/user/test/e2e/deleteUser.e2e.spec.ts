import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { RoleTypes } from '../../../auth/enums/roles';
import { UserDto } from '../../dto/user.dto';
import { generateUserFromDb, mockId } from '../mock/user.model.mock';
import { mockUserService } from '../mock/user.service.mock';
import { MockGuards, setupApp, setupModule } from './setup';

describe('user', () => {
  let app: NestApplication;
  let mockUser: UserDto;
  let module: TestingModule;

  beforeAll(async () => {
    mockUser = generateUserFromDb({ roles: [RoleTypes.User] });
    module = await setupModule();
    app = await setupApp(module, MockGuards.Owner);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('/DELETE :id', () => {
    const TEST_PATH = '/user/';
    it(`should return ${HttpStatus.OK} and deleted user`, async () => {
      const res = await request(app.getHttpServer())
        .delete(`${TEST_PATH}${mockUser._id}`)
        .set('authorization', JSON.stringify(mockUser))
        .expect(HttpStatus.OK);
      expect(res.body._id).toEqual(mockUser._id);
    });
    it(`should return ${HttpStatus.NOT_FOUND} when user does not exist`, async () => {
      mockUserService.delete.mockReturnValueOnce(null);
      await request(app.getHttpServer())
        .delete(`${TEST_PATH}${mockUser._id}`)
        .set('authorization', JSON.stringify(mockUser))
        .expect(HttpStatus.NOT_FOUND);
    });
    it(`should return ${HttpStatus.FORBIDDEN} when user tries to delete another user`, async () => {
      mockUserService.delete.mockReturnValueOnce(null);
      await request(app.getHttpServer())
        .delete(`${TEST_PATH}${mockId}`)
        .set('authorization', JSON.stringify(mockUser))
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
