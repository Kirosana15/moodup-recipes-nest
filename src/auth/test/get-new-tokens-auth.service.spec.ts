import { UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { generateUserFromDb } from '../../user/test/mock/user.model.mock';
import { mockUserService } from '../../user/test/mock/user.service.mock';
import { UserService } from '../../user/user.service';
import { TOKEN_KEY } from '../auth.constants';
import { AuthService } from '../auth.service';
import { AccessTokenDto, RefreshTokenDto } from '../dto/tokens.dto';

describe('AuthService.validateUser()', () => {
  let authService: AuthService;
  let userService: UserService;
  let updateCheckSpy: jest.SpyInstance;
  let jwt: JwtService;
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
    userService = module.get<UserService>(UserService);
    jwt = module.get<JwtService>(JwtService);
    updateCheckSpy = jest.spyOn(userService, 'updateCheck');
  });

  it(`should return accessToken and refreshToken for user`, async () => {
    const user = generateUserFromDb();
    const tokens = await authService.getNewTokens(user);
    const { accessToken, refreshToken } = tokens;
    const accessTokenDecoded = <AccessTokenDto>jwt.decode(accessToken);
    const refreshTokenDecoded = <RefreshTokenDto>jwt.decode(refreshToken);

    expect(accessTokenDecoded.username).toBe(user.username);
    expect(refreshTokenDecoded.check).not.toBe(user.check);
  });

  it(`should throw UnauthorizedException when user does not exist`, async () => {
    updateCheckSpy.mockReturnValueOnce(null);
    const res = authService.getNewTokens(generateUserFromDb());
    expect(res).rejects.toThrowError(UnauthorizedException);
  });
});
