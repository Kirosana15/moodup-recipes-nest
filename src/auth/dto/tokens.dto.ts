export class RefreshTokenDto {
  _id: string;
  check: string;
}

export class AccessTokenDto {
  _id: string;
  username: string;
  isAdmin: boolean;
  createdAt: number;
}
