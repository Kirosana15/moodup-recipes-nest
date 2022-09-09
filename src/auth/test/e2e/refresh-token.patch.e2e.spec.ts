import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';

import { sendRequest } from '../../../../test/helpers/request';
import { setupApp, setupModule } from './setup';

describe('AuthController', () => {
  let app: NestApplication;

  beforeAll(async () => {
    const module = await setupModule();
    app = await setupApp(module);
  });

  const request = (app: NestApplication, status: HttpStatus) => {
    return sendRequest(app, 'patch', '/auth/refresh-token', status);
  };

  it('should return new set of tokens', async () => {
    const res = await request(app, HttpStatus.OK);
    const { accessToken, refreshToken } = res.body;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });
});
