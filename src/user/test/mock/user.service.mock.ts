import { UserCredentialsDto } from '../../dto/user.dto';
import { generateUserFromDb, generateUsers, mockPassword } from './user.model.mock';
import bcrypt from 'bcrypt';
import { PaginatedQueryDto } from '../../../dto/queries.dto';

export const mockUserService = {
  create: jest.fn().mockImplementation((userCredentialsDto: UserCredentialsDto) => {
    return generateUserFromDb(userCredentialsDto);
  }),
  getByUsername: jest.fn().mockImplementation(async (username: string) => {
    const hash = await bcrypt.hash(mockPassword, 10);
    return generateUserFromDb({ username, password: hash });
  }),
  getAll: jest.fn().mockImplementation((paginatedQueryDto: PaginatedQueryDto) => {
    const { page, limit } = paginatedQueryDto;
    return generateUsers(limit);
  }),
};
