import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { mockCredentials, mockPassword, mockUsername } from '../../user/test/mock/user.model.mock';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { mockAuthService } from './mock/auth.service';

describe('AuthController', () => {
  let service: AuthService;
  let controller: AuthController;
  let app: NestApplication;
  let loginSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    loginSpy = jest.spyOn(service, 'login');
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /login', () => {
    const PATH = '/login';
    it(`should return ${HttpStatus.CREATED} and access token for user`, async () => {
      const res = await request(app.getHttpServer()).post(PATH).send(mockCredentials).expect(HttpStatus.CREATED);
      const user = res.body;
      expect(user._id).toBeDefined();
      expect(user.username).toBe(mockUsername);
      expect(loginSpy).toBeCalledTimes(1);
    });

    it(`should return ${HttpStatus.NOT_FOUND} when username is too short`, async () => {
      const res = await request(app.getHttpServer())
        .post(PATH)
        .send({ username: 'bob', password: mockPassword })
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toMatch('username must be longer');
    });

    it(`should return ${HttpStatus.NOT_FOUND} when password is too short`, async () => {
      const res = await request(app.getHttpServer())
        .post(PATH)
        .send({ username: mockUsername, password: 'P4$s' })
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toMatch('password must be longer');
    });

    it(`should return ${HttpStatus.NOT_FOUND} when username doesn't match regex`, async () => {
      const res = await request(app.getHttpServer())
        .post(PATH)
        .send({ username: '$andrzej$', password: mockPassword })
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toMatch('username can only contain');
    });

    it(`should return ${HttpStatus.NOT_FOUND} when password doesn't match regex`, async () => {
      const res = await request(app.getHttpServer())
        .post(PATH)
        .send({ username: mockUsername, password: 'password' })
        .expect(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toMatch('password must contain');
    });
  });
});
