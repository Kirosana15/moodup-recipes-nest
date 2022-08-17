import { UserCredentialsDto } from '../../../user/dto/user.credentials.dto';
import { generateUserFromDb } from '../../../user/test/mock/user.model.mock';

export const mockAuthService = {
  login: jest
    .fn()
    .mockImplementation((userCredentialsDto: UserCredentialsDto) => generateUserFromDb(userCredentialsDto)),
};
