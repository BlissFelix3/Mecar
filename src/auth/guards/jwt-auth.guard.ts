import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const roles = new RolesGuard(this.reflector);
    const request = context.switchToHttp().getRequest();
    // Checking for valid JWT token and required roles
    return (
      (super.canActivate(context) && roles.canActivate(context)) ||
      this.validateRequest(request)
    );
  }

  handleRequest(user: any) {
    try {
      if (!user) {
        throw new UnauthorizedException(
          'User has logged out. Please log in again.',
        );
      }

      return user;
    } catch (error: any) {
      return { message: error.message };
    }
  }

  private validateRequest(request: any): boolean {
    return request.cookies && request.cookies['jwtToken'];
  }
}
