import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';

import { sendRequest } from '../../../../test/helpers/request';
import { mockCredentials, mockPassword, mockUsername } from '../../../user/test/mock/user.model.mock';
import { AuthService } from '../../auth.service';
import { setupApp, setupModule } from './setup';

describe('POST /login', () => {
  let service: AuthService;
  let app: NestApplication;
  let validateUserSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await setupModule();
    app = await setupApp(module);

    service = module.get<AuthService>(AuthService);
    validateUserSpy = jest.spyOn(service, 'validateUser');
  });

  describe('POST /login', () => {
    const request = (status: HttpStatus, user: { username: string; password: string }) => {
      return sendRequest(app, 'post', '/auth/login', status, undefined, undefined, user);
    };

    it(`should return ${HttpStatus.OK} and set of tokens for user`, async () => {
      const res = await request(HttpStatus.OK, mockCredentials);
      const tokens = res.body;
      const { accessToken, refreshToken } = tokens;
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(validateUserSpy).toBeCalledTimes(1);
    });

    it(`should return ${HttpStatus.UNAUTHORIZED} when login does not exist in database`, async () => {
      validateUserSpy.mockRejectedValueOnce(null);
      const res = await request(HttpStatus.UNAUTHORIZED, { username: 'Bob', password: mockPassword });
      expect(res.body.message).toMatch('Unauthorized');
    });

    it(`should return ${HttpStatus.UNAUTHORIZED} when password does not match the username`, async () => {
      validateUserSpy.mockRejectedValueOnce(null);
      const res = await request(HttpStatus.UNAUTHORIZED, { username: mockUsername, password: 'P4$s' });
      expect(res.body.message).toMatch('Unauthorized');
    });
  });
});
