import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Mechanic } from '../mechanic/entities/mechanic.entity';
import { CarOwner } from '../car-owner/entities/car-owner.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request.cookies['refreshToken'],
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<User | Mechanic | CarOwner> {
    try {
      const user = await this.authService.validateUserById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      return { ...user, roles: user.roles };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
