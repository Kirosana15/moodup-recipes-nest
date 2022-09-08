import { CanActivate, ExecutionContext } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';

import { AppMetadata, createApp } from '../../../../test/e2e.setup';
import { CustomModuleMetadata, createModule } from '../../../../test/test.setup';
import { RoleTypes } from '../../../auth/enums/roles';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { mockUserService } from '../mock/user.service.mock';

export const setupModule = (overrideMetadata?: CustomModuleMetadata) => {
  const metadata = {
    moduleMetadata: { providers: [UserService], controllers: [UserController] },
    providerOverrides: [{ provider: UserService, mock: mockUserService }],
    ...overrideMetadata,
  };
  return createModule(metadata);
};

export const setupApp = (module: TestingModule, guardType?: MockGuards, overrideMetadata?: AppMetadata) => {
  const metadata = {
    globalGuards: [getGuard(guardType)],
    ...overrideMetadata,
  };
  return createApp(module, metadata);
};

export enum MockGuards {
  Simple,
  Owner,
  AdminOnly,
}
const getGuard = (guard?: MockGuards): CanActivate => {
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
