import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { generateUserFromDb, mockCheck, mockId } from '../../user/test/mock/user.model.mock';
import { AccessTokenDto } from '../dto/tokens.dto';
import { AuthService } from '../auth.service';
import { TOKEN_KEY } from '../auth.constants';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { generateCheck } from '../../user/helpers/generateCheck';
import { mockUserService } from '../../user/test/mock/user.service.mock';

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
    const user = generateUserFromDb({ check: mockCheck });
    const { _id, check } = user;
    const payload = { _id, check };
    getByIdSpy.mockResolvedValueOnce(user);
    const { accessToken, refreshToken } = await authService.refreshTokens(payload);
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(getByIdSpy).toBeCalledTimes(1);
    const decoded = <AccessTokenDto>jwt.decode(accessToken);
    expect(decoded.username).toBe(user.username);
    expect(refreshToken).not.toEqual(payload);
    expect(decoded._id).toBe(_id);
  });

  it('should throw UnauthorizedException when invalid token is presented', async () => {
    const payload = { _id: mockId, check: generateCheck() };
    await expect(authService.refreshTokens(payload)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when user does not exist', async () => {
    const payload = { _id: mockId, check: generateCheck() };
    await expect(authService.refreshTokens(payload)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when check does not match database', async () => {
    const user = generateUserFromDb();
    getByIdSpy.mockResolvedValueOnce(user);
    const { _id } = user;
    const payload = { _id, check: '' };
    await expect(authService.refreshTokens(payload)).rejects.toThrow(UnauthorizedException);
  });
});
