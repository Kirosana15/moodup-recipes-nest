import { JwtService } from '@nestjs/jwt';

import { generateUserFromDb } from '../../../user/test/mock/user.model.mock';
import { AuthService } from '../../auth.service';
import { AccessTokenDto, RefreshTokenDto } from '../../dto/tokens.dto';
import { setupModule } from './setup';

describe('AuthService.validateUser()', () => {
  let authService: AuthService;
  let jwt: JwtService;
  beforeAll(async () => {
    const module = await setupModule();
    authService = module.get<AuthService>(AuthService);
    jwt = module.get(JwtService);
  });

  it(`should return accessToken and refreshToken for user`, async () => {
    const user = generateUserFromDb();
    const tokens = await authService.getNewTokens(user);
    const { accessToken, refreshToken } = tokens;
    const accessTokenDecoded = <AccessTokenDto>jwt.decode(accessToken);
    const refreshTokenDecoded = <RefreshTokenDto>jwt.decode(refreshToken);

    expect(accessTokenDecoded.username).toBe(user.username);
    expect(refreshTokenDecoded._id).toBe(user._id);
  });
});
