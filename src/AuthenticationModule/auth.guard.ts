import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './auth.constants';
import { IS_PUBLIC_KEY } from '../Decorators/public.decorator';
import { PERMISSIONS_KEY } from '../Decorators/permissions.decorator';
import { ROLES_KEY } from '../Decorators/roles.decorator';
import { Action, Resource, RoleName } from 'src/Common/Enums/auth.enum';
import { log } from 'console';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(
        'Không tìm thấy token, Vui lòng đăng nhập',
      );
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (requiredRoles && !this.hasRoles(payload, requiredRoles)) {
        throw new UnauthorizedException('Không có quyền truy cập');
      }

      const requiredPermissions = this.reflector.getAllAndOverride<
        { resource: Resource; actions: Action[] }[]
      >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
      if (
        requiredPermissions &&
        !this.hasPermissions(payload, requiredPermissions)
      ) {
        throw new UnauthorizedException('Không đủ quyền truy cập');
      }

      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private hasPermissions(
    payload: any,
    requiredPermissions: { resource: Resource; actions: Action[] }[],
  ): boolean {
    const userPermissions = payload.permissions || [];

    const permissionsMap = userPermissions.reduce(
      (acc, permission) => {
        if (!acc[permission.resource]) {
          acc[permission.resource] = new Set(permission.actions);
        } else {
          permission.actions.forEach((action) =>
            acc[permission.resource].add(action),
          );
        }
        return acc;
      },
      {} as Record<Resource, Set<Action>>,
    );
    if (
      permissionsMap[Resource.All] &&
      permissionsMap[Resource.All].has(Action.All)
    ) {
      return true;
    }

    return requiredPermissions.every((requiredPermission) => {
      const userActions =
        permissionsMap[requiredPermission.resource] || new Set<Action>();

      return requiredPermission.actions.every(
        (requiredAction) =>
          userActions.has(requiredAction) || userActions.has(Action.All),
      );
    });
  }

  private hasRoles(payload: any, requiredRoles: string[]): boolean {
    const userRoles = payload.roles || [];
    return (
      userRoles.includes(RoleName.Admin) ||
      requiredRoles.some((role) => userRoles.includes(role))
    );
  }
}
