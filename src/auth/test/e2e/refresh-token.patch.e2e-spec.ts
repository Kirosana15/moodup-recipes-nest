import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AuthController } from '../../auth.controller';
import { AuthService } from '../../auth.service';
import { mockAuthService } from '../mock/auth.service.mock';

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
    const { accessToken, refreshToken } = res.body;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });
});
