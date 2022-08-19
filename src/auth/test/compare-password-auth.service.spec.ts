import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';

import { mockPassword } from '../../user/test/mock/user.model.mock';
import { mockUserService } from '../../user/test/mock/user.service.mock';
import { UserService } from '../../user/user.service';
import { TOKEN_KEY } from '../auth.constants';
import { AuthService } from '../auth.service';

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
