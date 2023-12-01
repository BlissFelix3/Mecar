import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    return true;
  }

  handleRequest(err: any, user: any): any {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException('Unrecognized Email/PhoneNumber or Password')
      );
    }
    return user;
  }
}
