import { ConflictException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { mockCredentials, mockPassword } from '../../../user/test/mock/user.model.mock';
import { mockUserService } from '../../../user/test/mock/user.service.mock';
import { UserService } from '../../../user/user.service';
import { TOKEN_KEY } from '../../auth.constants';
import { AuthService } from '../../auth.service';

describe('AuthService.register()', () => {
  let service: AuthService;
  let userService: UserService;
  let createSpy: jest.SpyInstance;

  beforeAll(async () => {
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

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    createSpy = jest.spyOn(userService, 'create');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return new user', async () => {
    const user = await service.register(mockCredentials);
    expect(user).toBeDefined();
    expect(user._id).toBeDefined();
    const createdUser = await userService.getByUsername(user.username);
    expect(createdUser?.password).not.toEqual(mockPassword);
    expect(createSpy).toBeCalledTimes(1);
  });

  it('should throw an error if username was already used', async () => {
    createSpy.mockRejectedValueOnce({ code: 11000 });
    const user = service.register(mockCredentials);
    await expect(user).rejects.toThrowError(ConflictException);
  });
});
