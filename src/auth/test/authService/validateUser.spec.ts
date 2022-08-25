import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { mockCredentials } from '../../../user/test/mock/user.model.mock';
import { mockUserService } from '../../../user/test/mock/user.service.mock';
import { UserService } from '../../../user/user.service';
import { TOKEN_KEY } from '../../auth.constants';
import { AuthService } from '../../auth.service';

describe('AuthService.validateUser()', () => {
  let authService: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({ secret: TOKEN_KEY, signOptions: { expiresIn: '60m' } }),
        {
          module: class FakeModule {},
          providers: [{ provide: UserService, useValue: mockUserService }],
          exports: [UserService],
        },
      ],
      providers: [AuthService],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });

  it(`should return user data`, async () => {
    const user = await authService.validateUser(mockCredentials);
    expect(user).toBeDefined();
    expect(user?.username).toEqual(mockCredentials.username);
    expect(user?.check).toBeDefined();
  });

  it(`should return null when password is not correct`, async () => {
    const user = await authService.validateUser({ ...mockCredentials, password: 'wrong' });
    expect(user).toBeNull();
  });
});
