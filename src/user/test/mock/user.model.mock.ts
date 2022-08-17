import { UserCredentialsDto } from '../../dto/user-credentials.dto';
import { faker } from '@faker-js/faker';
import { User } from '../../user.schema';
import { UserDto } from '../../dto/user-from-db.dto';

export const generateUsername = () => `${faker.name.firstName()}_${faker.name.lastName()}`;
export const generateMockId = faker.database.mongodbObjectId;

export const mockUsername = generateUsername();
export const mockPassword = faker.internet.password(10, false, undefined, 'aA$1');
export const mockId = generateMockId();
export const mockCredentials: UserCredentialsDto = { username: mockUsername, password: mockPassword };

export type UserPayload = Partial<User>;

export const generateUser = (user?: UserPayload): UserPayload => {
  return {
    username: user?.username || generateUsername(),
    isAdmin: user?.isAdmin || false,
    createdAt: user?.createdAt || faker.date.past().getTime(),
  };
};

export const generateUserFromDb = (user?: Partial<UserDto>): UserDto => ({
  _id: user?._id || generateMockId(),
  username: user?.username || generateUsername(),
  password: user?.password || faker.internet.password(10, false, undefined, 'aA$1'),
  isAdmin: user?.isAdmin || false,
  check: user?.check || faker.datatype.string(20),
  createdAt: user?.createdAt || faker.date.past().getTime(),
});

export const generateUsers = (count: number): UserPayload[] => {
  return Array.from(Array(count), generateUser);
};

export const mockBasicAuthString = (username: string, password: string): string => {
  const plainString = `${username}:${password}`;
  const b64String = Buffer.from(plainString).toString('base64');
  return 'Basic ' + b64String;
};
