import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';

import { UserRole } from '../../users/enums/user-role';
import { JwtAccessGuard } from './jwt-access.guard';
import { RequestInterface } from '../interfaces/request.interface';

export const PermissionGuard = (permission: UserRole[]): Type<CanActivate> => {
  class PermissionGuardMixin extends JwtAccessGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestInterface>();

      if (!request.user || !request.user.role) {
        return false;
      }

      return permission.some((role) => request.user.role === role);
    }
  }

  return mixin(PermissionGuardMixin);
};
