import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '../../user/user.schema';
import { TOKEN_KEY } from '../auth.constants';
import { AuthService } from '../auth.service';
import { RefreshTokenDto, TokensDto } from '../dto/tokens.dto';

@Injectable()
export class RefreshBearerStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(private authService: AuthService) {
    super({
      secretOrKey: TOKEN_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      complete: true,
    });
  }

  async validate(payload: RefreshTokenDto): Promise<TokensDto> {
    return this.authService.refreshToken(payload);
  }
}

export class RefreshBearerGuard extends AuthGuard('refresh-jwt') {}
