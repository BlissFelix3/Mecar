import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'emailOrPhone',
    });
  }

  async validate(emailOrPhone: string, password: string): Promise<any> {
    return this.authService.validateUser(emailOrPhone, password);
  }
}
