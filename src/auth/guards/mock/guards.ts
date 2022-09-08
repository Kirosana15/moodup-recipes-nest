import { CanActivate, ExecutionContext } from '@nestjs/common';

import { RoleTypes } from '../../enums/roles';

export enum MockGuards {
  Simple,
  Owner,
  AdminOnly,
}
export const getMockGuard = (guard?: MockGuards): CanActivate => {
  switch (guard) {
    case MockGuards.Simple:
      return {
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          if (!req.headers['authorization']) {
            return false;
          }
          req.user = JSON.parse(req.headers['authorization']);
          return true;
        },
      };

    case MockGuards.Owner:
      return {
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          if (!req.headers['authorization']) {
            return false;
          }
          req.user = JSON.parse(req.headers['authorization']);
          const id = req.params._id;
          return req.user._id === id;
        },
      };

    case MockGuards.AdminOnly:
      return {
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          if (!req.headers['authorization']) {
            return false;
          }
          req.user = JSON.parse(req.headers['authorization']);
          return req.user.roles.includes(RoleTypes.Admin);
        },
      };
    default:
      return { canActivate: () => true };
  }
};
