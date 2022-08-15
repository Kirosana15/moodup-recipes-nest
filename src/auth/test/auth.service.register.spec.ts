import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { userServiceMock } from './mock/user.service';
import { TOKEN_KEY } from '../auth.constants';
import { generateUser, mockCredentials, mockPassword, mockUsername } from '../../user/test/mock/user.model.mock';
import { ConflictException } from '@nestjs/common';

describe('AuthService.register()', () => {
  let service: AuthService;
  let userService: UserService;
  let createSpy: jest.SpyInstance;

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

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    createSpy = jest.spyOn(userService, 'create');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return new user', async () => {
    const user = await service.register(mockCredentials);
    expect(user?._id).toBeDefined();
    expect(user?.password).not.toBe(mockPassword);
    expect(createSpy).toBeCalledTimes(1);
  });

  it('should throw an error if username was already used', async () => {
    createSpy.mockRejectedValueOnce({ code: 11000 });
    const user = service.register(mockCredentials);
    await expect(user).rejects.toThrowError(ConflictException);
  });
});