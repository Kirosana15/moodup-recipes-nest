import { HttpStatus } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';

import { sendRequest } from '../../../../test/helpers/request';
import { UserCredentialsDto } from '../../../user/dto/user.dto';
import { mockCredentials, mockPassword, mockUsername } from '../../../user/test/mock/user.model.mock';
import { AuthService } from '../../auth.service';
import { setupApp, setupModule } from './setup';

describe('POST auth/register', () => {
  let service: AuthService;
  let app: NestApplication;
  let registerSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await setupModule();
    app = await setupApp(module);

    service = module.get<AuthService>(AuthService);
    registerSpy = jest.spyOn(service, 'register');
  });

  describe('POST auth/register', () => {
    const request = (app: NestApplication, status: HttpStatus, credentials: UserCredentialsDto) => {
      return sendRequest(app, 'post', '/auth/register', status, undefined, undefined, credentials);
    };

    it(`should return ${HttpStatus.CREATED} and newly registered user`, async () => {
      const res = await request(app, HttpStatus.CREATED, mockCredentials);
      const user = res.body;
      expect(user._id).toBeDefined();
      expect(user.username).toBe(mockUsername);
      expect(registerSpy).toBeCalledTimes(1);
    });

    it(`should return ${HttpStatus.BAD_REQUEST} when username is too short`, async () => {
      const res = await request(app, HttpStatus.BAD_REQUEST, { username: 'bob', password: mockPassword });
      expect(res.body.message[0]).toMatch('username must be longer');
    });

    it(`should return ${HttpStatus.BAD_REQUEST} when password is too short`, async () => {
      const res = await request(app, HttpStatus.BAD_REQUEST, { username: mockUsername, password: 'P4$s' });
      expect(res.body.message[0]).toMatch('password must be longer');
    });

    it(`should return ${HttpStatus.BAD_REQUEST} when username doesn't match regex`, async () => {
      const res = await request(app, HttpStatus.BAD_REQUEST, { username: '$andrzej$', password: mockPassword });
      expect(res.body.message[0]).toMatch('username can only contain');
    });

    it(`should return ${HttpStatus.BAD_REQUEST} when password doesn't match regex`, async () => {
      const res = await request(app, HttpStatus.BAD_REQUEST, { username: mockUsername, password: 'password' });
      expect(res.body.message[0]).toMatch('password must contain');
    });
  });
});
