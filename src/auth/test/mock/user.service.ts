import { JwtModule } from '@nestjs/jwt';
import { UserCredentialsDto } from '../../../user/dto/user.credentials.dto';
import { generateCheck } from '../../../user/helpers/generateCheck';
import { generateMockToken, generateUser, generateUserFromDb } from '../../../user/test/mock/user.model.mock';
import { User } from '../../../user/user.schema';

export const userServiceMock = {
  create: jest.fn().mockImplementation((userCredentialsDto: UserCredentialsDto) => {
    return generateUserFromDb(userCredentialsDto);
  }),
  getByUsername: jest.fn().mockImplementation((userCredentialsDto: UserCredentialsDto) => {
    return generateUserFromDb(userCredentialsDto);
  }),
  getById: jest.fn().mockImplementation((_id: string) => {
    return generateUserFromDb({ _id });
  }),
  refreshToken: jest.fn().mockImplementation((check: string) => {
    return generateCheck();
  }),
};
