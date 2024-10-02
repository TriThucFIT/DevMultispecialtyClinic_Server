import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './auth.constants';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Action, Resource } from 'src/enums/auth.enum';

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

      const requiredPermissions = this.reflector.getAllAndOverride<
        { resource: Resource; actions: Action[] }[]
      >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
      if (
        requiredPermissions &&
        !this.hasPermissions(payload, requiredPermissions)
      ) {
        throw new UnauthorizedException('Không đủ quyền truy cập');
      }

      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (requiredRoles && !this.hasRoles(payload, requiredRoles)) {
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

    return requiredPermissions.every((requiredPermission) => {
      const matchingUserPermission = userPermissions.find(
        (userPermission) =>
          userPermission.resource === requiredPermission.resource ||
          userPermission.resource === Resource.All,
      );
      if (!matchingUserPermission) return false;

      return requiredPermission.actions.some(
        (requiredAction) =>
          matchingUserPermission.actions.includes(requiredAction) ||
          matchingUserPermission.actions.includes(Action.All),
      );
    });
  }
  private hasRoles(payload: any, requiredRoles: string[]): boolean {
    const userRoles = payload.roles || [];
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
