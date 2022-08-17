import { UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';
import { mockCredentials, mockUsername, UserPayload } from '../../user/test/mock/user.model.mock';
import { UserService } from '../../user/user.service';
import { TOKEN_KEY } from '../auth.constants';
import { AuthService } from '../auth.service';
import { userServiceMock } from './mock/user.service';

describe('AuthService.login()', () => {
  let authService: AuthService;
  let userService: UserService;
  let getByUsernameSpy: jest.SpyInstance;
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
    getByUsernameSpy = jest.spyOn(userService, 'getByUsername');
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should return access token', async () => {
    const { access_token } = await authService.login(mockCredentials);
    expect(access_token).toBeDefined();
    expect(getByUsernameSpy).toBeCalledTimes(1);
    const { username } = <UserPayload>jwt.decode(access_token);
    expect(username).toBe(mockUsername);
  });

  it('should throw error when user does not exist', async () => {
    getByUsernameSpy.mockResolvedValue(null);
    const token = authService.login(mockCredentials);
    await expect(token).rejects.toThrow(UnauthorizedException);
  });
  it('should throw error when password does not match hashed password', async () => {
    getByUsernameSpy.mockResolvedValue({ password: 'fake' });
    const token = authService.login(mockCredentials);
    await expect(token).rejects.toThrow(UnauthorizedException);
  });
});
