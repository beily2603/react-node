import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/config/token';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/Decorators/public/public.decorator';
import * as jwt from 'jsonwebtoken';
import { ROLES_KEY } from 'src/Decorators/roles/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log('authGuard');
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // const isUser = this.reflector.getAllAndOverride<boolean>(ROLES_KEY, [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);
    if (isPublic) {
      return true;
    }
    // if(isUser) {
    //   return true;
    // }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    // console.log('token=', token);
    if (!token) {
      // console.log('!token')
      //return true;
      throw new UnauthorizedException();
    }
    try {
      // const payload = await this.jwtService.verifyAsync(token, { secret: jwtConstants.SECRETE_KEY });
      const payload = await this.jwtService.signAsync(token, { secret: jwtConstants.SECRETE_KEY });
      // console.log('payload=', payload);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'bearer' ? token : undefined;
  }
}
