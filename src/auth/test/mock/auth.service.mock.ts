import { UserCredentialsDto } from '../../../user/dto/user-from-db.dto';
import { generateUserFromDb } from '../../../user/test/mock/user.model.mock';

export const mockAuthService = {
  register: jest
    .fn()
    .mockImplementation((userCredentialsDto: UserCredentialsDto) => generateUserFromDb(userCredentialsDto)),
  login: jest
    .fn()
    .mockImplementation((userCredentialsDto: UserCredentialsDto) => generateUserFromDb(userCredentialsDto)),
};
