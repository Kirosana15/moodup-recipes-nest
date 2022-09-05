import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

<<<<<<< HEAD
=======
import { closeConnections, rootMongooseTestModule } from '../../mock/db.mock';
>>>>>>> 602f588 (extend functionality of recipeMock)
import { User, UserSchema } from '../user.schema';
import { UserService } from '../user.service';
import { closeConnections, rootMongooseTestModule } from './mock/db.mock';
import { mockCredentials, mockId } from './mock/user.model.mock';

describe('UserService.refreshToken()', () => {
  let service: UserService;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
      providers: [UserService],
    }).compile();

    service = module.get(UserService);
  });

  afterAll(async () => {
    await closeConnections();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a new refresh token', async () => {
    const newRefresh = await service.refreshToken(mockId, '');
    expect(newRefresh).toBeDefined();
  });

  it('should change users refreshToken in database', async () => {
    const user = await service.create(mockCredentials);
    await service.refreshToken(user._id, 'token');
    const changedUser = await service.getById(user._id);
    expect(user.refreshToken).not.toBe(changedUser?.refreshToken);
  });
});
