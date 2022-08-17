export class UserDto {
  _id: string;
  username: string;
  password: string;
  isAdmin: boolean;
  refreshToken: string;
  createdAt: number;
}
