import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { userServiceMock } from './mock/user.service';
import { TOKEN_KEY } from '../auth.constants';
import bcrypt from 'bcrypt';
import { mockPassword, mockUsername } from '../../user/test/mock/user.model.mock';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: TOKEN_KEY, signOptions: { expiresIn: '60m' } })],
      providers: [AuthService],
    })
      .useMocker(token => {
        if (token === UserService) {
          return userServiceMock;
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return new user', async () => {
    const user = await service.register({ username: mockUsername, password: mockPassword });
    expect(user?._id).toBeDefined();
    expect(user?.password).not.toBe(mockPassword);
  });

  it('should throw an error if username was already used', async () => {});
});
