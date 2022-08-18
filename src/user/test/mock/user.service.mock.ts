import { generateUserFromDb, generateUsers, mockPassword } from './user.model.mock';

import { PaginatedQueryDto } from '../../../dto/queries.dto';
import { UserCredentialsDto } from '../../dto/user.dto';
import bcrypt from 'bcrypt';
import { generateCheck } from '../../helpers/generateCheck';

export const mockUserService = {
  create: jest.fn().mockImplementation((userCredentialsDto: UserCredentialsDto) => {
    return generateUserFromDb(userCredentialsDto);
  }),
  getByUsername: jest.fn().mockImplementation(async (username: string) => {
    const hash = await bcrypt.hash(mockPassword, 10);
    return generateUserFromDb({ username, password: hash });
  }),
  getAll: jest.fn().mockImplementation((paginatedQueryDto: Partial<PaginatedQueryDto>) => {
    const limit = paginatedQueryDto.limit || 20;
    return generateUsers(limit);
  }),
  getById: jest.fn().mockImplementation((id: string) => {
    return generateUserFromDb({ _id: id });
  }),
  refreshToken: jest.fn().mockReturnValue(generateCheck()),
};
