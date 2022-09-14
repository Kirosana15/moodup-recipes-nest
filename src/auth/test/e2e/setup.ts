import { TestingModule } from '@nestjs/testing';

import { AppMetadata, createApp } from '../../../../test/e2e.setup';
import { CustomModuleMetadata, createModule } from '../../../../test/test.setup';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../auth.service';
import { LocalStrategy } from '../../strategies/local.strategy';
import { mockAuthService } from '../mock/auth.service.mock';

export const setupModule = (overrideMetadata?: CustomModuleMetadata) => {
  const metadata: CustomModuleMetadata = {
    moduleMetadata: {
      controllers: [AuthController],
      providers: [LocalStrategy, AuthService],
    },
    providerOverrides: [{ provider: AuthService, mock: mockAuthService }],
    ...overrideMetadata,
  };
  return createModule(metadata);
};

export const setupApp = (module: TestingModule, overrideMetadata?: AppMetadata) => {
  const metadata = {
    ...overrideMetadata,
  };
  return createApp(module, metadata);
};
