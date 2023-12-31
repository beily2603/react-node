import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/Decorators/roles/roles.decorator';
import { Area } from 'src/location/entities/location.entity';
import { Role } from 'src/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean {
    // console.log('rolesGuard.canActivate');
    const requiredRoles = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      // console.log('requiredRoles: ', requiredRoles);
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    // console.log('user: ' + user);
    // return requiredRoles.some((role) => user.roles?.includes(role));
    return requiredRoles === Role.Admin || requiredRoles === Role.User;
  }





  }