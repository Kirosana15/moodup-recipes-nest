import { TestingModule } from '@nestjs/testing';

import { AppMetadata, createApp } from '../../../../test/e2e.setup';
import { CustomModuleMetadata, createModule } from '../../../../test/test.setup';
import { MockGuards, getMockGuard } from '../../../auth/guards/mock/guards';
import { RecipeController } from '../../recipe.controller';
import { RecipeService } from '../../recipe.service';
import { mockRecipeService } from '../mock/recipeService.mock';

export const setupModule = (overrideMetadata?: CustomModuleMetadata) => {
  const metadata = {
    moduleMetadata: { providers: [RecipeService], controllers: [RecipeController] },
    providerOverrides: [{ provider: RecipeService, mock: mockRecipeService }],
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
