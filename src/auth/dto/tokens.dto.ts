import { ApiProperty } from '@nestjs/swagger';

import { RoleTypes } from '../enums/roles';

export class RefreshTokenDto {
  id: string;
}

export class AccessTokenDto {
  id: string;
  username: string;
  roles: RoleTypes[];
  createdAt: Date;
}

export class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
