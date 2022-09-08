import { CanActivate, PipeTransform, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

const defaultMetadata = {
  globalGuards: [],
  globalPipes: [new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } })],
};

export const createApp = async (module: TestingModule, metadata?: AppMetadata): Promise<NestApplication> => {
  const { globalPipes, globalGuards } = { ...defaultMetadata, ...metadata };
  const app: NestApplication = module.createNestApplication();
  app.useGlobalPipes(...globalPipes);
  app.useGlobalGuards(...globalGuards);
  return app.init();
};

export interface AppMetadata {
  globalGuards?: CanActivate[];
  globalPipes?: PipeTransform[];
}
