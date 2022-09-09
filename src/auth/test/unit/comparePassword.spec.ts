import { TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';

import { mockPassword } from '../../../user/test/mock/user.model.mock';
import { AuthService } from '../../auth.service';
import { setupModule } from './setup';

describe('AuthService.validateUser()', () => {
  let authService: AuthService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await setupModule();
    authService = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await module.close();
  });

  it(`should return true if password matches hash`, async () => {
    const hash = await bcrypt.hash(mockPassword, 10);
    const isValid = await authService.comparePassword(mockPassword, hash);
    expect(isValid).toStrictEqual(true);
  });

  it(`should return false when password is not correct`, async () => {
    const isValid = await authService.comparePassword(mockPassword, 'pass');
    expect(isValid).toStrictEqual(false);
  });
});
