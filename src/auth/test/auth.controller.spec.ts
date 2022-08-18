import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import request from 'supertest';
import { NestApplication } from '@nestjs/core';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let getNewTokensSpy: jest.SpyInstance;
  let app: NestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    getNewTokensSpy = jest.spyOn(authService, 'getNewTokens');
    app = module.createNestApplication();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should return new set of tokens', async () => {
    const res = await request(app.getHttpServer()).get('auth/refresh-token');
  });
});
