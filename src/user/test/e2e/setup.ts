import { TestingModule } from '@nestjs/testing';

import { AppMetadata, createApp } from '../../../../test/e2e.setup';
import { CustomModuleMetadata, createModule } from '../../../../test/test.setup';
import { MockGuards, getMockGuard } from '../../../auth/guards/mock/guards';
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
    globalGuards: [getMockGuard(guardType)],
    ...overrideMetadata,
  };
  return createApp(module, metadata);
};
