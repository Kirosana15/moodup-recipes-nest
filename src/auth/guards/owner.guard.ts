import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

import { RoleTypes } from '../enums/roles';

export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const { user, params } = req;
    if (user?._id === params._id || user?.roles.includes(RoleTypes.Admin)) {
      return true;
    }
    return false;
  }
}
