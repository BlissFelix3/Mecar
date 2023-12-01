import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MechanicService } from 'src/mechanic/mechanic.service';
import { CarOwnerService } from 'src/car-owner/car-owner.service';
import { User } from '../users/entities';
import { TwilioService } from './otp_twilio/otp.service';
import { UserService } from 'src/users/users.service';
import { JwtPayload } from './interface/jwt-payload.interface';
import { Response as ExpressResponse } from 'express';
import { UserRole } from 'src/shared/enums';
import { ConfigService } from '@nestjs/config';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mechanicService: MechanicService,
    private readonly carOwnerService: CarOwnerService,
    private readonly twilioService: TwilioService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  private generateUniqueToken(): string {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substr(2);
    return timestamp + randomString;
  }

  async signup(
    userDto: SignupDto,
  ): Promise<{ user: User; otpMessage: string }> {
    const [existingEmailUser, existingPhoneUser] = await Promise.all([
      this.userRepository.findOne({ where: { email: userDto.email } }),
      this.userRepository.findOne({ where: { phoneNumber: userDto.phone } }),
    ]);

    if (existingEmailUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    if (existingPhoneUser) {
      throw new UnauthorizedException(
        'User with this phone number already exists',
      );
    }

    const hashedPassword = await argon2.hash(userDto.password);

    const registrationToken = this.generateUniqueToken();

    const user = this.userRepository.create({
      name: userDto.name,
      email: userDto.email,
      phoneNumber: userDto.phone,
      password: hashedPassword,
      registrationToken,
    });

    await this.userRepository.save(user);

    user.roles = [UserRole.USER];

    try {
      const { message, verificationSid } =
        await this.twilioService.sendOtp(user);
      return {
        user,
        otpMessage: `${message}. VerificationSid: ${verificationSid}`,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Failed to send OTP. Phone Number Unverified.',
      );
    }
  }

  async login(loginDto: LoginDto, response: ExpressResponse): Promise<any> {
    const findUser = await this.userRepository.findOne({
      where: [
        { email: loginDto.emailOrPhone },
        { phoneNumber: loginDto.emailOrPhone },
      ],
    });

    if (!findUser) throw new NotFoundException('USER_NOT_FOUND');

    if (!findUser.isPhoneVerified)
      throw new ForbiddenException('Phone number not verified');

    const user = await this.validateUser(
      loginDto.emailOrPhone,
      loginDto.password,
    );

    if (!user) {
      throw new HttpException(
        'Invalid email or phone number or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    let message = '';
    let verificationSid = '';

    if (user.isTwoFactorEnabled) {
      const { message: twoFAMessage, verificationSid: twoFAVerificationSid } =
        await this.twilioService.generate2FA(user);
      message = twoFAMessage;
      verificationSid = twoFAVerificationSid;
    }

    const jwtToken = await this.generateJwtToken(findUser.id, findUser.email);
    const refreshToken = await this.generateRefreshToken(
      findUser.id,
      findUser.email,
    );

    const userRoles = user.roles;

    let additionalInfo = {};
    if (userRoles.includes(UserRole.CAR_OWNER)) {
      const carOwner = await this.carOwnerService.getCarOwnerRole(findUser.id);
      additionalInfo = { carOwner };
    } else if (userRoles.includes(UserRole.MECHANIC)) {
      const mechanic = await this.mechanicService.getMechanicRole(findUser.id);
      additionalInfo = { mechanic };
    }

    // Set cookies using the 'cookie' package
    const cookieOptions = {
      httpOnly: true,
    };

    response.cookie('refreshToken', refreshToken, cookieOptions);

    return {
      jwtToken,
      user: findUser,
      ...additionalInfo,
      verificationSid,
      message,
    };
  }

  async enableTwoFactorAuthentication(
    user: User,
    phoneNumber: string,
  ): Promise<{ message: string; verificationSid: string }> {
    if (user.isTwoFactorEnabled) {
      throw new ConflictException(
        'Two-factor authentication is already enabled.',
      );
    }

    try {
      const { message, verificationSid } =
        await this.twilioService.generate2FA(user);

      user.phoneNumber = phoneNumber;
      user.isTwoFactorEnabled = true;

      await this.userService.save(user);

      return {
        message: `Two-factor authentication enabled. ${message}:`,
        verificationSid,
      };
    } catch (error) {
      throw new Error('Failed to enable two-factor authentication');
    }
  }

  async disableTwoFactorAuthentication(userId: string): Promise<void> {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isTwoFactorEnabled === false) {
      throw new BadRequestException('Two Factor Already Disabled');
    }

    user.isTwoFactorEnabled = false;
    await this.userRepository.save(user);
  }

  async verifyTwoFactorAuthentication(
    userId: string,
    code: string,
    verificationSid: string,
  ): Promise<void> {
    const user = await this.userService.findById(userId);

    if (!user || !user.isTwoFactorEnabled) {
      throw new BadRequestException(
        'Two-factor authentication is not enabled.',
      );
    }

    const isCodeValid = await this.twilioService.verify2FA(
      user,
      code,
      verificationSid,
    );

    if (!isCodeValid) {
      throw new BadRequestException('Invalid verification code.');
    }

    await this.userService.save(user);
  }

  async verifyOtp(
    phoneNumber: string,
    dto: VerifyOtpDto,
    verificationSid: string,
  ): Promise<{ success: boolean }> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber },
    });

    if (!user) {
      throw new UnauthorizedException('User not Found');
    }

    await this.twilioService.verifyOtp(user, dto, verificationSid);
    return { success: true };
  }

  async resendOtp(phoneNumber: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { phoneNumber } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const { message, verificationSid } =
        await this.twilioService.resendOtp(user);
      return {
        message: `${message}. VerificationSid: ${verificationSid}`,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to resend OTP. Phone Number Unverified.',
      );
    }
  }

  async sendResetPasswordEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = await this.generateResetToken(user.id, user.email);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await this.mailService.sendResetPasswordEmail(user.email, resetLink);
    } catch (error: any) {
      console.error('Error sending reset password email:', error);
      throw new BadRequestException('Failed to send reset password email');
    }
  }

  async resetPasswordWithToken(
    token: string,
    newPassword: string,
    confirmNewPassword: string,
  ): Promise<void> {
    // Verify and decode the token
    const decodedToken = await this.verifyJwtToken(token);

    // Use the decoded information to find the user
    const user = await this.userRepository.findOne({
      where: { id: decodedToken.sub, email: decodedToken.username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if newPassword matches confirmNewPassword
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException(
        'New password and confirm new password do not match',
      );
    }

    // Update the user's password
    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;

    // Save the updated user
    await this.userRepository.save(user);
  }

  private async generateResetToken(
    userId: string,
    email: string,
  ): Promise<string> {
    const payload: JwtPayload = { sub: userId, username: email };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  async logout(response: ExpressResponse): Promise<void> {
    response.clearCookie('refreshToken', { expires: new Date(0) });
  }

  async validateUser(
    emailOrPhone: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userService.findByEmailOrPhone(
      emailOrPhone,
      emailOrPhone,
    );

    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }

    return null;
  }

  async validateUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async verifyJwtToken(token: string, options?: any): Promise<JwtPayload> {
    try {
      return this.jwtService.verifyAsync(token, options);
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async generateJwtToken(userId: string, username: string): Promise<string> {
    const payload: JwtPayload = { sub: userId, username };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(
    userId: string,
    username: string,
  ): Promise<string> {
    const payload: JwtPayload = { sub: userId, username };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES'),
    });
  }

  async validateUserByJwt(payload: JwtPayload): Promise<any> {
    return this.userService.findById(payload.sub);
  }

  async validateUserByRefreshToken(payload: JwtPayload): Promise<any> {
    return this.userService.findById(payload.sub);
  }

  async viewProfile(user: User) {
    const foundUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!foundUser) throw new NotFoundException('USER_NOT_FOUND');

    return foundUser;
  }

  async changePassword(dto: ChangePasswordDto, user: User): Promise<any> {
    const { currentPassword, newPassword } = dto;

    const foundUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!foundUser) throw new NotFoundException('USER_NOT_FOUND');

    const isPasswordValid = await argon2.verify(
      foundUser.password,
      currentPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current Password is incorrect');
    }

    const hashedPassword = await argon2.hash(newPassword);

    foundUser.password = hashedPassword;

    await this.userRepository.save(foundUser);
  }
}
