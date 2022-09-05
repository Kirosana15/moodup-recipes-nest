import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { UserInfoDto } from '../../user/dto/user.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserInfoDto> {
    return this.authService.validateUser({ username, password });
  }
}
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
