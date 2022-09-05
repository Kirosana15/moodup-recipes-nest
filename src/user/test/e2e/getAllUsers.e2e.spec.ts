import { ExecutionContext, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { RoleTypes } from '../../../auth/enums/roles';
import { UserDto, UserInfoDto } from '../../dto/user.dto';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { generateUserFromDb } from '../mock/user.model.mock';
import { mockUserService } from '../mock/user.service.mock';

describe('POST /login', () => {
  let service: UserService;
  let controller: UserController;
  let app: NestApplication;
  let getAllSpy: jest.SpyInstance;
  let mockUser: UserDto;

  beforeEach(async () => {
    mockUser = generateUserFromDb({ roles: [RoleTypes.User] });
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();
    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    getAllSpy = jest.spyOn(service, 'getAll');
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));
    app.useGlobalGuards({
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = req.body;
        return mockUser.roles.includes(RoleTypes.Admin);
      },
    });
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /user/all/', () => {
    const TESTING_PATH = '/user/all';

    it(`should return ${HttpStatus.OK} and a list of all users`, async () => {
      mockUser.roles.push(RoleTypes.Admin);
      const res = await request(app.getHttpServer()).get(TESTING_PATH).expect(HttpStatus.OK);
      const users = res.body;
      expect(users).toHaveLength(20);
      users.forEach((user: UserInfoDto) => {
        expect(user._id).toBeDefined();
      });
      expect(getAllSpy).toBeCalledTimes(1);
    });

    it(`should return ${HttpStatus.FORBIDDEN} when user is not an admin`, async () => {
      await request(app.getHttpServer()).get(TESTING_PATH).expect(HttpStatus.FORBIDDEN);
    });
    it(`should return ${HttpStatus.OK} and page $page of users`, async () => {
      mockUser.roles.push(RoleTypes.Admin);
      const res = await request(app.getHttpServer())
        .get(TESTING_PATH)
        .send({ isAdmin: true })
        .query({ page: 2 })
        .expect(HttpStatus.OK);
      const users = res.body;
      expect(users).toHaveLength(20);
    });

    it(`should return ${HttpStatus.OK} and $limit amount of users`, async () => {
      mockUser.roles.push(RoleTypes.Admin);
      const res = await request(app.getHttpServer())
        .get(TESTING_PATH)
        .send({ isAdmin: true })
        .query({ limit: 10 })
        .expect(HttpStatus.OK);
      const users = res.body;
      expect(users).toHaveLength(10);
    });

    it(`should return ${HttpStatus.BAD_REQUEST} when page is not a number`, async () => {
      mockUser.roles.push(RoleTypes.Admin);
      const res = await request(app.getHttpServer())
        .get(TESTING_PATH)
        .send({ isAdmin: true })
        .query({ page: 'two' })
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toMatch('page must be a number');
    });

    it(`should return ${HttpStatus.BAD_REQUEST} when limit is not a number`, async () => {
      mockUser.roles.push(RoleTypes.Admin);
      const res = await request(app.getHttpServer())
        .get(TESTING_PATH)
        .send({ isAdmin: true })
        .query({ limit: 'two' })
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toMatch('limit must be a number');
    });
  });
});
