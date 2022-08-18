import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { generateUserFromDb, mockCheck, mockId } from '../../user/test/mock/user.model.mock';
import { AccessTokenDto } from '../dto/tokens.dto';
import { AuthService } from '../auth.service';
import { TOKEN_KEY } from '../auth.constants';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { generateCheck } from '../../user/helpers/generateCheck';
import { userServiceMock } from './mock/user.service';

describe('AuthService.getNewTokens()', () => {
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
          providers: [{ provide: UserService, useValue: userServiceMock }],
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
    const token = jwt.sign({ _id, check });
    getByIdSpy.mockResolvedValueOnce(user);
    const { access_token, refresh_token } = await authService.getNewTokens(token);
    expect(access_token).toBeDefined();
    expect(refresh_token).toBeDefined();
    expect(getByIdSpy).toBeCalledTimes(1);
    const decoded = <AccessTokenDto>jwt.decode(access_token);
    expect(decoded.username).toBe(user.username);
    expect(refresh_token).not.toBe(token);
    expect(decoded._id).toBe(_id);
  });

  it('should throw UnauthorizedException when invalid token is presented', async () => {
    const token = jwt.sign({ _id: mockId, check: generateCheck() });
    await expect(authService.getNewTokens(token)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when user does not exist', async () => {
    await expect(authService.getNewTokens('token')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when invalid check does not match database', async () => {
    const user = generateUserFromDb({ check: mockCheck });
    getByIdSpy.mockResolvedValueOnce(user);
    const { _id } = user;
    const token = jwt.sign({ _id, check: 'check' });
    await expect(authService.getNewTokens(token)).rejects.toThrow(UnauthorizedException);
  });
});
