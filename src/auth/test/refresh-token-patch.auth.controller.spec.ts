import { ExecutionContext, HttpStatus, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { generateMockToken } from '../../user/test/mock/user.model.mock';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { RefreshBearerGuard } from '../strategies/refresh.bearer.strategy';
import { mockAuthService } from './mock/auth.service.mock';

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
    })
      .overrideGuard(RefreshBearerGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          if (req.body.noToken || req.body.wrongCheck) {
            throw new UnauthorizedException();
          }
          req.user = { accessToken: generateMockToken(), refreshToken: generateMockToken() };
          return true;
        },
      })
      .compile();

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

  it(`should return ${HttpStatus.UNAUTHORIZED} when no token is presented`, async () => {
    await request(app.getHttpServer()).patch(TESTED_PATH).send({ noToken: true }).expect(HttpStatus.UNAUTHORIZED);
  });

  it(`should return ${HttpStatus.UNAUTHORIZED} when check does not match`, async () => {
    await request(app.getHttpServer()).patch(TESTED_PATH).send({ wrongCheck: true }).expect(HttpStatus.UNAUTHORIZED);
  });
});
