import { CanActivate, ModuleMetadata, Type } from '@nestjs/common';
import { ModelDefinition } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

export const createModule = async (metadata?: CustomModuleMetadata): Promise<TestingModule> => {
  const module = Test.createTestingModule(metadata as ModuleMetadata);

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
