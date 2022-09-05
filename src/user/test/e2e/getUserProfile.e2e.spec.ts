import { ExecutionContext, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { RoleTypes } from '../../../auth/enums/roles';
import { UserDto } from '../../dto/user.dto';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { generateUserFromDb } from '../mock/user.model.mock';
import { mockUserService } from '../mock/user.service.mock';

describe('user', () => {
  let app: NestApplication;
  let mockUser: UserDto;

  beforeEach(async () => {
    mockUser = generateUserFromDb({ roles: [RoleTypes.User] });
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));
    app.useGlobalGuards({
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = mockUser;
        return true;
      },
    });
    await app.init();
  });

  afterEach(() => {
    app.close();
  });
  describe('/GET me', () => {
    it(`should return ${HttpStatus.OK} and user info`, async () => {
      const { password: _password, refreshToken: _refreshToken, ...user } = mockUser;
      const res = await request(app.getHttpServer()).get('/user/me');
      expect(res.body).toEqual(user);
    });
  });
});
