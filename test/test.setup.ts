import { DynamicModule, ForwardReference, ModuleMetadata, Type } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { User, UserSchema } from '../src/user/user.schema';
import { rootMongooseTestModule } from './mock/db.mock';

export const createModule = async (metadata?: CustomModuleMetadata): Promise<TestingModule> => {
  const imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
    rootMongooseTestModule(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ];
  if (metadata?.imports !== undefined) {
    imports.concat(metadata.imports);
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
  return module.compile();
};

export interface CustomModuleMetadata extends ModuleMetadata {
  providerOverrides?: { provider: Type<any>; mock: { [key: string]: jest.Mock } }[];
}
