// permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Action, Resource } from '../enums/auth.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (
  [...permissions]: { resource: Resource; actions: Action[] }[]
) => SetMetadata(PERMISSIONS_KEY, permissions);
