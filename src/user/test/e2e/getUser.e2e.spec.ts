import { ExecutionContext, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { UserInfoDto } from '../../dto/user.dto';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { generateUser } from '../mock/user.model.mock';
import { mockUserService } from '../mock/user.service.mock';

describe('user', () => {
  let service: UserService;
  let app: NestApplication;
  let mockUser: UserInfoDto;

  beforeEach(async () => {
    mockUser = generateUser();
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
    service = module.get(UserService);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));
    app.useGlobalGuards({
      canActivate(context) {
        return true;
      },
    });
    await app.init();
  });
  afterEach(async () => {
    await app.close();
  });
  describe('/GET :id', () => {
    const TEST_PATH = '/user/';
    it(`should return ${HttpStatus.OK} and user information`, async () => {
      const res = await request(app.getHttpServer()).get(`${TEST_PATH}${mockUser._id}`).expect(HttpStatus.OK);
      expect(res.body._id).toEqual(mockUser._id);
    });
    it(`should return ${HttpStatus.NOT_FOUND} when user does not exist`, async () => {
      mockUserService.getById.mockReturnValueOnce(null);
      await request(app.getHttpServer()).get(`${TEST_PATH}${mockUser._id}`).expect(HttpStatus.NOT_FOUND);
    });
  });
});
