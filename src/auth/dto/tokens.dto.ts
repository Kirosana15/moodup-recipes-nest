import { ApiProperty } from '@nestjs/swagger';

import { RoleTypes } from '../enums/roles';

export class RefreshTokenDto {
  _id: string;
  refreshToken: string;
}

export class AccessTokenDto {
  _id: string;
  username: string;
  roles: RoleTypes[];
  createdAt: number;
}

export class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
