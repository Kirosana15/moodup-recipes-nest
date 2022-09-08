import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { createApp } from '../../../../test/e2e.setup';
import { createModule } from '../../../../test/test.setup';
import { RoleTypes } from '../../../auth/enums/roles';
import { UserDto, UserInfoDto } from '../../dto/user.dto';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { generateUserFromDb } from '../mock/user.model.mock';
import { mockUserService } from '../mock/user.service.mock';

describe('POST /login', () => {
  let service: UserService;
  let app: NestApplication;
  let getAllSpy: jest.SpyInstance;
  let mockUser: UserDto;
  let module: TestingModule;

  beforeAll(async () => {
    mockUser = generateUserFromDb({ roles: [RoleTypes.User, RoleTypes.Admin] });

    module = await createModule({
      providers: [UserService],
      controllers: [UserController],
      providerOverrides: [{ provider: UserService, mock: mockUserService }],
    });

    const guardMock = {
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = req.body;
        return req.body.roles.includes(RoleTypes.Admin);
      },
    };

    app = await createApp(module, { globalGuards: [guardMock] });

    service = module.get<UserService>(UserService);
    getAllSpy = jest.spyOn(service, 'getAll');
  });

  afterAll(async () => {
    await module.close();
  });

  describe('GET /user/all/', () => {
    const TESTING_PATH = '/user/all';

    it(`should return ${HttpStatus.OK} and a list of all users`, async () => {
      const res = await request(app.getHttpServer()).get(TESTING_PATH).send(mockUser).expect(HttpStatus.OK);
      const users = res.body;
      expect(users).toHaveLength(10);
      users.forEach((user: UserInfoDto) => {
        expect(user._id).toBeDefined();
      });
      expect(getAllSpy).toBeCalledTimes(1);
    });

    it(`should return ${HttpStatus.FORBIDDEN} when user is not an admin`, async () => {
      await request(app.getHttpServer())
        .get(TESTING_PATH)
        .send({ ...mockUser, roles: [RoleTypes.User] })
        .expect(HttpStatus.FORBIDDEN);
    });
    it(`should return ${HttpStatus.OK} and page $page of users`, async () => {
      const res = await request(app.getHttpServer())
        .get(TESTING_PATH)
        .send(mockUser)
        .query({ page: 2 })
        .expect(HttpStatus.OK);
      const users = res.body;
      expect(users).toHaveLength(10);
    });

    it(`should return ${HttpStatus.OK} and $limit amount of users`, async () => {
      const res = await request(app.getHttpServer())
        .get(TESTING_PATH)
        .send(mockUser)
        .query({ limit: 10 })
        .expect(HttpStatus.OK);
      const users = res.body;
      expect(users).toHaveLength(10);
    });

    it(`should return ${HttpStatus.BAD_REQUEST} when page is not a number`, async () => {
      const res = await request(app.getHttpServer())
        .get(TESTING_PATH)
        .send(mockUser)
        .query({ page: 'two' })
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toMatch('page must be a number');
    });

    it(`should return ${HttpStatus.BAD_REQUEST} when limit is not a number`, async () => {
      const res = await request(app.getHttpServer())
        .get(TESTING_PATH)
        .send(mockUser)
        .query({ limit: 'two' })
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toMatch('limit must be a number');
    });
  });
});
