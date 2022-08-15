import { getModelToken, InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user.schema';
import { UserService } from '../user.service';
import { mockPassword, mockUsername, UserMock } from './mock/user.model.mock';

describe('UserService', () => {
  let service: UserService;
  let userMock: UserMock;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: UserMock,
        },
      ],
    }).compile();

    service = module.get(UserService);
    userMock = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user', async () => {
    const userCredentials = { username: mockUsername, password: mockPassword };
    const user = await service.create(userCredentials);
    expect(user.username).toBe(mockUsername);
  });
});
