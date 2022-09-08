import { CanActivate, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

export const createApp = async (
  module: TestingModule,
  metadata?: { guards?: CanActivate[] },
): Promise<NestApplication> => {
  const app: NestApplication = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));
  if (metadata?.guards !== undefined) {
    app.useGlobalGuards(...metadata.guards);
  }
  return app.init();
};
