import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserInfoDto } from '../../user/dto/user.dto';
import { TOKEN_KEY } from '../auth.constants';
import { AuthService } from '../auth.service';
import { AccessTokenDto, RefreshTokenDto, TokensDto } from '../dto/tokens.dto';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: TOKEN_KEY,
      passReqToCallback: true,
    });
  }
  async validate(
    req: { headers: { authorization: string } },
    payload: AccessTokenDto | RefreshTokenDto,
  ): Promise<TokensDto> {
    const token = req.headers.authorization.split(' ')[1];
    const user = this.authService.refreshTokens(payload.id, token);
    return user;
  }
}
