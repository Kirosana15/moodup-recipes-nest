import { ExecutionContext, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { RoleTypes } from '../../../auth/enums/roles';
import { UserDto } from '../../dto/user.dto';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { generateUserFromDb, mockId } from '../mock/user.model.mock';
import { mockUserService } from '../mock/user.service.mock';

describe('user', () => {
  let app: NestApplication;
  let mockUser: UserDto;

  beforeAll(async () => {
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
        const id = req.params._id;
        return mockUser._id === id;
      },
    });
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  describe('/DELETE :id', () => {
    const TEST_PATH = '/user/';
    it(`should return ${HttpStatus.OK} and deleted user`, async () => {
      const res = await request(app.getHttpServer()).delete(`${TEST_PATH}${mockUser._id}`).expect(HttpStatus.OK);
      expect(res.body._id).toEqual(mockUser._id);
    });
    it(`should return ${HttpStatus.NOT_FOUND} when user does not exist`, async () => {
      mockUserService.delete.mockReturnValueOnce(null);
      await request(app.getHttpServer()).delete(`${TEST_PATH}${mockUser._id}`).expect(HttpStatus.NOT_FOUND);
    });
    it(`should return ${HttpStatus.FORBIDDEN} when user tries to delete another user`, async () => {
      mockUserService.delete.mockReturnValueOnce(null);
      await request(app.getHttpServer()).delete(`${TEST_PATH}${mockId}`).expect(HttpStatus.FORBIDDEN);
    });
  });
});
