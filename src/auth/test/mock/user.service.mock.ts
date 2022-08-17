import { UserCredentialsDto } from '../../../user/dto/user-from-db.dto';
import { generateUserFromDb, mockPassword } from '../../../user/test/mock/user.model.mock';
import bcrypt from 'bcrypt';

export const userServiceMock = {
  create: jest.fn().mockImplementation((userCredentialsDto: UserCredentialsDto) => {
    return generateUserFromDb(userCredentialsDto);
  }),
  getByUsername: jest.fn().mockImplementation(async (username: string) => {
    const hash = await bcrypt.hash(mockPassword, 10);
    return generateUserFromDb({ username, password: hash });
  }),
};
