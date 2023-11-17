import {
  Body,
  Post,
  Controller,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
  // Patch,
  Param,
  // Request,
  // Response,
  HttpException,
  HttpStatus,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
// import { RolesGuard } from './guards/roles.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
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

  @Post('send-otp')
  async sendOtp(
    @Body('phoneNumber') phoneNumber: string,
  ): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findOne({
        where: { phoneNumber },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      await this.twilioService.sendOtp(user);
      return { message: 'OTP sent successfully' };
    } catch (error: any) {
      throw new BadRequestException(
        'Failed to send OTP. Phone Number is not registered.',
      );
    }
  }

  @Post('verify-otp/:phoneNumber')
  async verifyOtp(
    @Param('phoneNumber') phoneNumber: string,
    @Body() dto: VerifyOtpDto,
    @Body('verificationSid') verificationSid: string,
  ): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findOne({
        where: { phoneNumber },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      await this.twilioService.verifyOtp(user, dto, verificationSid);
      return { message: 'OTP verified successfully' };
    } catch (error: any) {
      throw new BadRequestException('Failed to verify OTP: ' + error.message);
    }
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }

  @ApiBearerAuth()
  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async viewProfile(@GetUser() user: User) {
    return this.authService.viewProfile(user);
  }
}
