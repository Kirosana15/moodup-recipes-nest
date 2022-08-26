import { ApiProperty } from '@nestjs/swagger';

import { Roles } from '../enums/roles';

export class RefreshTokenDto {
  _id: string;
  check: string;
}

export class AccessTokenDto {
  _id: string;
  username: string;
  roles: Roles[];
  createdAt: number;
}

export class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
