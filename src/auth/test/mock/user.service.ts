import { UserCredentialsDto } from '../../../user/dto/user.credentials.dto';
import { generateUser, generateUserFromDb } from '../../../user/test/mock/user.model.mock';
import { User } from '../../../user/user.schema';

export const userServiceMock = {
  create: jest.fn().mockImplementation((userCredentialsDto: UserCredentialsDto) => {
    return generateUserFromDb(userCredentialsDto);
  }),
  getByUsername: jest.fn().mockImplementation((userCredentialsDto: UserCredentialsDto) => {
    return generateUserFromDb(userCredentialsDto);
  }),
};
