import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';

import { sendRequest } from '../../../../test/helpers/request';
import { mockRefreshToken } from '../../../user/test/mock/user.model.mock';
import { setupApp, setupModule } from './setup';

describe('AuthController', () => {
  let app: NestApplication;

  beforeAll(async () => {
    const module = await setupModule();
    app = await setupApp(module);
  });

  const request = (status: HttpStatus, header?: Record<'field' | 'val', string>) => {
    return sendRequest(app, 'patch', '/auth/refresh-token', status, undefined, undefined, undefined, header);
  };

  it('should return new set of tokens', async () => {
    const res = await request(HttpStatus.OK, { field: 'authorization', val: mockRefreshToken });
    const { accessToken, refreshToken } = res.body;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });
  it(`should return ${HttpStatus.UNAUTHORIZED} when no token is provided`, async () => {
    await request(HttpStatus.UNAUTHORIZED);
  });
  it(`should return ${HttpStatus.UNAUTHORIZED} when invalid token is provided`, async () => {
    await request(HttpStatus.UNAUTHORIZED, { field: 'authorization', val: 'bad' });
  });
});
