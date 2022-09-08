import { CanActivate, ModuleMetadata, Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

export const createModule = async (metadata?: CustomModuleMetadata): Promise<TestingModule> => {
  const moduleMetadata = { ...metadata?.moduleMetadata };
  const module = Test.createTestingModule(moduleMetadata);

  metadata?.providerOverrides?.forEach(({ provider, mock }) => {
    module.overrideProvider(provider).useValue(mock);
  });

  metadata?.guardOverrides?.forEach(({ guard, mock }) => {
    module.overrideGuard(guard).useValue(mock);
  });

  return module.compile();
};

export interface CustomModuleMetadata {
  moduleMetadata?: ModuleMetadata;
  providerOverrides?: { provider: Type<any>; mock: { [key: string]: jest.Mock } }[];
  guardOverrides?: { guard: Type<any>; mock: CanActivate }[];
}
