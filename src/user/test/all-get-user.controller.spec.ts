import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { UserInfoDto } from '../dto/user.dto';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { mockUserService } from './mock/user.service.mock';

describe('POST /login', () => {
  let service: UserService;
  let controller: UserController;
  let app: NestApplication;
  let getAllSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /user/all/', () => {
    const PATH = '/user/all';

    it(`should return ${HttpStatus.OK} and a list of all users`, async () => {
      const res = await request(app.getHttpServer()).get(PATH).expect(HttpStatus.OK);
      const users = res.body;
      expect(users).toHaveLength(20);
      users.forEach((user: UserInfoDto) => {
        expect(user._id).toBeDefined();
      });
      expect(getAllSpy).toBeCalledTimes(1);
    });

    it(`should return ${HttpStatus.OK} and page $page of users`, async () => {
      const res = await request(app.getHttpServer()).get(PATH).query({ page: 2 }).expect(HttpStatus.OK);
      const users = res.body;
      expect(users).toHaveLength(20);
    });

    it(`should return ${HttpStatus.OK} and $limit amount of users`, async () => {
      const res = await request(app.getHttpServer()).get(PATH).query({ limit: 10 }).expect(HttpStatus.OK);
      const users = res.body;
      expect(users).toHaveLength(10);
    });

    it(`should return ${HttpStatus.BAD_REQUEST} when page is not a number`, async () => {
      const res = await request(app.getHttpServer()).get(PATH).query({ page: 'two' }).expect(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toMatch('page must be a number');
    });

    it(`should return ${HttpStatus.BAD_REQUEST} when limit is not a number`, async () => {
      const res = await request(app.getHttpServer()).get(PATH).query({ limit: 'two' }).expect(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toMatch('limit must be a number');
    });
  });
});
