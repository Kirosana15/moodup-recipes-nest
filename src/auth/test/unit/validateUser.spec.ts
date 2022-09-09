import { UnauthorizedException } from '@nestjs/common';
import { setupModule } from './setup';
import { UserDto } from '../../../user/dto/user.dto';

import { mockCredentials } from '../../../user/test/mock/user.model.mock';
import { AuthService } from '../../auth.service';

describe('AuthService.validateUser()', () => {
  let authService: AuthService;
  beforeAll(async () => {
    const module = await setupModule();
    authService = module.get(AuthService);
  });

  it(`should return user data`, async () => {
    const user = <UserDto>await authService.validateUser(mockCredentials);
    expect(user).toBeDefined();
    expect(user?.username).toEqual(mockCredentials.username);
    expect(user?.refreshToken).not.toBeDefined();
  });

  it(`should throw UnauthorizedException when password is incorrect`, async () => {
    const user = authService.validateUser({ ...mockCredentials, password: 'wrong' });
    await expect(user).rejects.toThrowError(UnauthorizedException);
  });
});
