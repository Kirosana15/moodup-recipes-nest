import { UserCredentialsDto } from '../../../user/dto/user.dto';
import { generateMockToken, generateUserFromDb } from '../../../user/test/mock/user.model.mock';

export const mockAuthService = {
  register: jest
    .fn()
    .mockImplementation((userCredentialsDto: UserCredentialsDto) => generateUserFromDb(userCredentialsDto)),
  login: jest
    .fn()
    .mockImplementation((userCredentialsDto: UserCredentialsDto) => generateUserFromDb(userCredentialsDto)),
  validateUser: jest.fn().mockImplementation((credentials?: UserCredentialsDto) => generateUserFromDb(credentials)),
  getNewTokens: jest.fn().mockReturnValue({ accessToken: generateMockToken(), refreshToken: generateMockToken() }),
  refreshTokens: jest.fn().mockReturnValue({ accessToken: generateMockToken(), refreshToken: generateMockToken() }),
  comparePassword: jest.fn().mockReturnValue(true),
  hashPassword: jest.fn().mockReturnValue('hashed'),
};
