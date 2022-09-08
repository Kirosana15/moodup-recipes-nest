import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { createApp } from '../../../../test/e2e.setup';
import { createModule } from '../../../../test/test.setup';
import { RoleTypes } from '../../../auth/enums/roles';
import { UserDto } from '../../dto/user.dto';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { generateUserFromDb, mockId } from '../mock/user.model.mock';
import { mockUserService } from '../mock/user.service.mock';

describe('user', () => {
  let app: NestApplication;
  let mockUser: UserDto;
  let module: TestingModule;

  beforeAll(async () => {
    mockUser = generateUserFromDb({ roles: [RoleTypes.User] });
    module = await createModule({
      providers: [UserService],
      controllers: [UserController],
      providerOverrides: [{ provider: UserService, mock: mockUserService }],
    });

    const guardMock = {
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = mockUser;
        const id = req.params._id;
        return mockUser._id === id;
      },
    };

    app = await createApp(module, { guards: [guardMock] });
  });

  afterAll(async () => {
    await module.close();
  });

  describe('/DELETE :id', () => {
    const TEST_PATH = '/user/';
    it(`should return ${HttpStatus.OK} and deleted user`, async () => {
      const res = await request(app.getHttpServer()).delete(`${TEST_PATH}${mockUser._id}`).expect(HttpStatus.OK);
      expect(res.body._id).toEqual(mockUser._id);
    });
    it(`should return ${HttpStatus.NOT_FOUND} when user does not exist`, async () => {
      mockUserService.delete.mockReturnValueOnce(null);
      await request(app.getHttpServer()).delete(`${TEST_PATH}${mockUser._id}`).expect(HttpStatus.NOT_FOUND);
    });
    it(`should return ${HttpStatus.FORBIDDEN} when user tries to delete another user`, async () => {
      mockUserService.delete.mockReturnValueOnce(null);
      await request(app.getHttpServer()).delete(`${TEST_PATH}${mockId}`).expect(HttpStatus.FORBIDDEN);
    });
  });
});
