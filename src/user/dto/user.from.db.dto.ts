export class UserFullDto {
  _id: string;
  username: string;
  password: string;
  isAdmin: boolean;
  refreshToken: string;
  createdAt: number;
}

export class UserSafeDto {
  _id: string;
  username: string;
  isAdmin: boolean;
  createdAt: number;
}
