import { UserCredentialsDto, UserDto } from '../../dto/user.dto';

import { User } from '../../user.schema';
import { faker } from '@faker-js/faker';

export const generateUsername = () => `${faker.name.firstName()}_${faker.name.lastName()}`.slice(0, 20);
export const generateMockId = faker.database.mongodbObjectId;
export const generatePassword = () => faker.internet.password(10, false, undefined, 'aA$1');

export const mockUsername = generateUsername();
export const mockPassword = generatePassword();
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
  password: user?.password || generatePassword(),
  isAdmin: user?.isAdmin || false,
  check: user?.check || faker.datatype.string(20),
  createdAt: user?.createdAt || faker.date.past().getTime(),
});

export const generateUsers = (count: number): UserPayload[] => {
  return Array.from(Array(count), generateUser);
};

export const generateCredentials = (): UserCredentialsDto => {
  return { username: generateUsername(), password: generatePassword() };
};

export const generateCredentialsList = (count: number): UserCredentialsDto[] => {
  return Array.from(Array(count), generateCredentials);
};

export const mockBasicAuthString = (username: string, password: string): string => {
  const plainString = `${username}:${password}`;
  const b64String = Buffer.from(plainString).toString('base64');
  return 'Basic ' + b64String;
};
