import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Observable } from 'rxjs';

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

@Injectable()
export class BearerAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const noBearer = this.reflector.get('no-bearer', context.getHandler());
    if (!noBearer) {
      return super.canActivate(context);
    }
    return true;
  }
}
