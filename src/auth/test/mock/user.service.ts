import { UserCredentialsDto } from '../../../user/dto/user.credentials.dto';
import { generateUser, generateUserFromDb } from '../../../user/test/mock/user.model.mock';
import { User } from '../../../user/user.schema';

export const userServiceMock = {
  create: (userCredentialsDto: UserCredentialsDto) =>
    jest.fn().mockResolvedValue(generateUserFromDb(userCredentialsDto))(),
  getByUsername: jest.fn((username: string): Promise<User> => new Promise(resolve => generateUser({ username }))),
};
