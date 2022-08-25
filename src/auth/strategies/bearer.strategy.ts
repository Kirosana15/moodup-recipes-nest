import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserInfoDto } from '../../user/dto/user.dto';
import { TOKEN_KEY } from '../auth.constants';
import { AuthService } from '../auth.service';
import { AccessTokenDto } from '../dto/tokens.dto';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: TOKEN_KEY,
    });
  }
  async validate(payload: AccessTokenDto): Promise<UserInfoDto> {
    return payload;
  }
}

export class BearerAuthGuard extends AuthGuard('jwt') {}
