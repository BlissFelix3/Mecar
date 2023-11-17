import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities';
import { Mechanic } from 'src/mechanic/entities/mechanic.entity';
import { CarOwner } from 'src/car-owner/entities/car-owner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStrategy } from './local.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { MechanicModule } from 'src/mechanic/mechanic.module';
import { CarOwnerModule } from 'src/car-owner/car-owner.module';
import { CarOwnerService } from 'src/car-owner/car-owner.service';
import { MechanicService } from 'src/mechanic/mechanic.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { TwilioService } from './otp_twilio/otp.service';
import { UserService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Mechanic, CarOwner]),
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES') },
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_REFRESH_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),
    MechanicModule,
    CarOwnerModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    MechanicService,
    CarOwnerService,
    CloudinaryService,
    TwilioService,
    UserService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
