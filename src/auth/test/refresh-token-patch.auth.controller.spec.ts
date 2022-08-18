import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { NestApplication } from '@nestjs/core';
import { mockAuthService } from './mock/auth.service';
import request from 'supertest';

describe('AuthController', () => {
  let authController: AuthController;
  let app: NestApplication;

  const TESTED_PATH = '/auth/refresh-token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
      controllers: [AuthController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should return new set of tokens', async () => {
    const res = await request(app.getHttpServer()).patch(TESTED_PATH).expect(HttpStatus.OK);
    const { access_token, refresh_token } = res.body;
    expect(access_token).toBeDefined();
    expect(refresh_token).toBeDefined();
  });
});
