import { UserCredentialsDto, UserDto, UserInfoDto } from '../../dto/user.dto';

import { faker } from '@faker-js/faker';
import { generateCheck } from '../../helpers/generateCheck';

export const generateUsername = () => `${faker.name.firstName()}_${faker.name.lastName()}`.slice(0, 20);
export const generateMockId = faker.database.mongodbObjectId;
export const generatePassword = () => faker.internet.password(10, false, undefined, 'aA$1');

export const mockUsername = generateUsername();
export const mockPassword = generatePassword();
export const mockId = generateMockId();
export const mockCredentials: UserCredentialsDto = { username: mockUsername, password: mockPassword };
export const mockCheck = generateCheck();
export type UserPayload = Partial<UserDto>;

export const generateMockToken = () => {
  return Array.from(new Array(3), () => faker.internet.password(20, false, /[^\.]/)).join('.');
};

export const generateUser = (user?: UserPayload): UserInfoDto => {
  return {
    _id: user?._id || generateMockId(),
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
  const users = Array.from(Array(count), generateUser);
  return users;
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
