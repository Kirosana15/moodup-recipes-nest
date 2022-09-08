import { CanActivate, DynamicModule, ForwardReference, ModuleMetadata, Type } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from './mock/db.mock';

export const createModule = async (metadata?: CustomModuleMetadata): Promise<TestingModule> => {
  const imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [];
  if (metadata?.controllers === undefined) {
    imports.push(rootMongooseTestModule(), MongooseModule.forFeature(metadata?.model));
    if (metadata?.imports !== undefined) {
      imports.concat(metadata.imports);
    }
  }
  const module = Test.createTestingModule({
    imports,
    controllers: metadata?.controllers,
    providers: metadata?.providers,
    exports: metadata?.exports,
  });
  metadata?.providerOverrides?.forEach(({ provider, mock }) => {
    module.overrideProvider(provider).useValue(mock);
  });

  metadata?.guardOverrides?.forEach(({ guard, mock }) => {
    module.overrideGuard(guard).useValue(mock);
  });

  return module.compile();
};

export interface CustomModuleMetadata extends ModuleMetadata {
  providerOverrides?: { provider: Type<any>; mock: { [key: string]: jest.Mock } }[];
  guardOverrides?: { guard: Type<any>; mock: CanActivate }[];
  model?: ModelDefinition[];
}