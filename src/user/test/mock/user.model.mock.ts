import { UserCredentialsDto } from '../../dto/user.credentials.dto';
import { faker } from '@faker-js/faker';
import { User } from '../../user.schema';
import { UserFullDto } from '../../dto/user-from-db.dto';

export const mockUsername = faker.name.firstName();
export const mockPassword = faker.internet.password(10, false, undefined, 'aA$1');
export const mockId = faker.database.mongodbObjectId();
export const mockCredentials: UserCredentialsDto = { username: mockUsername, password: mockPassword };

export const generateMockId = faker.database.mongodbObjectId;

export type UserPayload = Partial<User>;

export const generateUser = (user?: UserPayload): UserPayload => {
  return {
    username: user?.username || faker.internet.userName(),
    isAdmin: user?.isAdmin || false,
    createdAt: user?.createdAt || faker.date.past().getTime(),
  };
};

export const generateUserFromDb = (user?: Partial<UserFullDto>): UserFullDto => ({
  _id: user?._id || generateMockId(),
  username: user?.username || faker.internet.userName(),
  password: user?.password || faker.internet.password(10),
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
