import { UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { generateUserFromDb, mockId } from '../../../user/test/mock/user.model.mock';
import { mockUserService } from '../../../user/test/mock/user.service.mock';
import { UserService } from '../../../user/user.service';
import { TOKEN_KEY } from '../../auth.constants';
import { AuthService } from '../../auth.service';
import { AccessTokenDto } from '../../dto/tokens.dto';

describe('AuthService.refreshTokens()', () => {
  let authService: AuthService;
  let userService: UserService;
  let getByIdSpy: jest.SpyInstance;
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
    getByIdSpy = jest.spyOn(userService, 'getById');
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should return access token and refresh token', async () => {
    const _id = mockId;
    const token = jwt.sign({ _id });
    const user = generateUserFromDb({ _id, refreshToken: token });
    getByIdSpy.mockResolvedValueOnce(user);
    const { accessToken, refreshToken } = await authService.refreshTokens(token);
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(getByIdSpy).toBeCalledTimes(1);
    const decoded = <AccessTokenDto>jwt.decode(accessToken);
    expect(decoded.username).toBe(user.username);
    expect(decoded._id).toBe(_id);
  });

  it('should throw UnauthorizedException when invalid token is presented', async () => {
    const token = jwt.sign({ _id: mockId });
    await expect(authService.refreshTokens(token)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when user does not exist', async () => {
    await expect(authService.refreshTokens('token')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when invalid refreshToken does not match database', async () => {
    const user = generateUserFromDb({ refreshToken: 'refreshToken' });
    getByIdSpy.mockResolvedValueOnce(user);
    const { _id } = user;
    const token = jwt.sign({ _id });
    await expect(authService.refreshTokens(token)).rejects.toThrow(UnauthorizedException);
  });
});
