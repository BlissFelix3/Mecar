import {
  Body,
  Post,
  Controller,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
  HttpException,
  HttpStatus,
  Req,
  Param,
  Get,
  Patch,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RolesGuard } from './guards/roles.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserRole } from 'src/shared/enums';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { serialize } from 'cookie';
import { Request, Response } from 'express';
import { TwilioService } from './otp_twilio/otp.service';
import { User } from '../users/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUser } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly twilioService: TwilioService,
  ) {}

  @Roles(UserRole.USER)
  @Post('signup')
  // @UseGuards(RolesGuard)
  async signup(
    @Body() signupDto: SignupDto,
  ): Promise<{ user: User; otpMessage: string }> {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    return this.authService.login(loginDto, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('enable-2fa')
  async enableTwoFactorAuthentication(
    @GetUser() user: User,
    @Body('phoneNumber') phoneNumber: string,
  ): Promise<{ message: string }> {
    try {
      const result = await this.authService.enableTwoFactorAuthentication(
        user,
        phoneNumber,
      );
      return { message: result.message };
    } catch (error) {
      return { message: 'Failed to enable two-factor authentication' };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('verify-2fa')
  async verifyTwoFactorAuthentication(
    @Headers('user-id') userId: string,
    @Body('code') code: string,
    @Body('verificationSid') verificationSid: string,
  ): Promise<{ message: string }> {
    await this.authService.verifyTwoFactorAuthentication(
      userId,
      code,
      verificationSid,
    );
    return { message: 'Two-factor authentication verified successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('disable-2fa')
  async disableTwoFactorAuthentication(
    @Headers('user-id') userId: string,
  ): Promise<{ message: string }> {
    await this.authService.disableTwoFactorAuthentication(userId);
    return { message: 'Two-Factor authentication disabled successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('resend-otp')
  async resendOtp(
    @Headers('phone-number') phoneNumber: string,
  ): Promise<{ message: string }> {
    try {
      return await this.authService.resendOtp(phoneNumber);
    } catch (error: any) {
      throw new BadRequestException('Failed to resend OTP: ' + error.message);
    }
  }

  @Post('verify-otp')
  async verifyOtp(
    @Headers('phone-number') phoneNumber: string,
    @Body() dto: VerifyOtpDto,
    @Body('verificationSid') verificationSid: string,
  ): Promise<{ message: string }> {
    try {
      await this.authService.verifyOtp(phoneNumber, dto, verificationSid);
      return { message: 'OTP verified successfully' };
    } catch (error: any) {
      throw new BadRequestException('Failed to verify OTP: ' + error.message);
    }
  }

  @Post('send-reset-password-email')
  async sendResetPasswordEmail(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    try {
      await this.authService.sendResetPasswordEmail(email);
      return { message: 'Reset password email sent successfully' };
    } catch (error: any) {
      throw new BadRequestException(
        'Failed to send reset password email: ' + error.message,
      );
    }
  }

  @Post('reset-password/:token')
  async resetPasswordWithToken(
    @Param('token') token: string,
    @Body('newPassword') newPassword: string,
    @Body('confirmNewPassword') confirmNewPassword: string,
  ): Promise<{ message: string }> {
    await this.authService.resetPasswordWithToken(
      token,
      newPassword,
      confirmNewPassword,
    );

    return { message: 'Password reset successful' };
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new HttpException(
        'Refresh token not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const decoded = await this.authService.verifyJwtToken(
        refreshToken,
        'refreshToken',
      );
      const user = await this.authService.validateUserByRefreshToken(decoded);

      if (!user) {
        throw new HttpException(
          'Invalid refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const newJwtToken = await this.authService.generateJwtToken(
        user.id,
        user.email,
      );

      const newRefreshToken = await this.authService.generateRefreshToken(
        user.id,
        user.email,
      );

      const newRefreshTokenCookie = serialize('refreshToken', newRefreshToken, {
        httpOnly: true,
      });

      res.setHeader('Set-Cookie', newRefreshTokenCookie);

      return { jwtToken: newJwtToken, user };
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }

  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async viewProfile(@GetUser() user: User) {
    return this.authService.viewProfile(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.changePassword(changePasswordDto, user);
    return { message: 'Password changed successfully' };
  }
}
