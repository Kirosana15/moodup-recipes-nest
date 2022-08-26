import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { mockCredentials, mockPassword, mockUsername } from '../../../user/test/mock/user.model.mock';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../auth.service';
import { LocalStrategy } from '../../strategies/local.strategy';
import { mockAuthService } from '../mock/auth.service.mock';

describe('POST /login', () => {
  let service: AuthService;
  let controller: AuthController;
  let app: NestApplication;
  let validateUserSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    validateUserSpy = jest.spyOn(service, 'validateUser');
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /login', () => {
    const PATH = '/auth/login';
    it(`should return ${HttpStatus.OK} and set of tokens for user`, async () => {
      const { username, password } = mockCredentials;
      const res = await request(app.getHttpServer()).post(PATH).auth(username, password).expect(HttpStatus.OK);
      const tokens = res.body;
      const { accessToken, refreshToken } = tokens;
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(validateUserSpy).toBeCalledTimes(1);
    });

    it(`should return ${HttpStatus.UNAUTHORIZED} when login does not exist in database`, async () => {
      validateUserSpy.mockRejectedValueOnce(null);
      const res = await request(app.getHttpServer())
        .post(PATH)
        .send({ username: 'bob', password: mockPassword })
        .expect(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).toMatch('Unauthorized');
    });

    it(`should return ${HttpStatus.UNAUTHORIZED} when password does not match the username`, async () => {
      validateUserSpy.mockRejectedValueOnce(null);
      const res = await request(app.getHttpServer())
        .post(PATH)
        .send({ username: mockUsername, password: 'P4$s' })
        .expect(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).toMatch('Unauthorized');
    });
  });
});
