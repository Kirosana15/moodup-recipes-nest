import bcrypt from 'bcrypt';

import { PaginatedQueryDto } from '../../../dto/queries.dto';
import { UserCredentialsDto, UserDto } from '../../dto/user.dto';
import { generateUserFromDb, generateUsers, mockPassword } from './user.model.mock';

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
  refreshToken: jest.fn().mockReturnValue(generateUserFromDb()),
  updateToken: jest.fn().mockImplementation((user: UserDto) => ({ ...user, refreshToken: '' })),
  delete: jest.fn().mockImplementation((id: string) => generateUserFromDb({ _id: id })),
};
