import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  _id: string;
  refreshToken: string;
}

export class AccessTokenDto {
  _id: string;
  username: string;
  isAdmin: boolean;
  createdAt: number;
}

export class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
