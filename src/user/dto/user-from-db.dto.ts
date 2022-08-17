export class UserDto {
  _id: string;
  username: string;
  password: string;
  isAdmin: boolean;
  check: string;
  createdAt: number;
}

export type UserSafeDto = Omit<UserDto, 'password' | 'check'>;
