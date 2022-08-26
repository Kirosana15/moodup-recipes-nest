import { SetMetadata } from '@nestjs/common';

export enum RoleTypes {
  Admin = 'admin',
  User = 'user',
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
