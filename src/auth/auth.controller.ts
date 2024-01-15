import {
  Body,
  Post,
  Controller,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
  Req,
  Param,
  Patch,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RolesGuard } from './guards/roles.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserRole } from 'src/common/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { TwilioService } from './otp_twilio/otp.service';
import { User } from '../users/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUser } from 'src/common/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { SendResetLinkDto } from './dto/send-reset-link.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { API_TAGS } from 'src/common/enums';

@ApiTags(API_TAGS.AUTH)
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
    @Body() sendLinkDto: SendResetLinkDto,
  ): Promise<{ message: string }> {
    try {
      await this.authService.sendResetPasswordEmail(sendLinkDto);
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
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.resetPasswordWithToken(token, resetPasswordDto);

    return { message: 'Password reset successful' };
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

  @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  @UseGuards(RolesGuard)
  async changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.changePassword(changePasswordDto, user);
    return { message: 'Password changed successfully' };
  }
}
