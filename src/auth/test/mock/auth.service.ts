import { UserCredentialsDto } from '../../../user/dto/user.credentials.dto';
import { generateMockToken, generateUserFromDb } from '../../../user/test/mock/user.model.mock';
import { RefreshTokenDto } from '../../dto/tokens.dto';

export const mockAuthService = {
  register: jest
    .fn()
    .mockImplementation((userCredentialsDto: UserCredentialsDto) => generateUserFromDb(userCredentialsDto)),
  getNewTokens: jest.fn().mockImplementation((refreshToken: string) => {
    return { access_token: generateMockToken(), refresh_token: generateMockToken() };
  }),
};
