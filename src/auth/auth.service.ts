import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MechanicService } from 'src/mechanic/mechanic.service';
import { CarOwnerService } from 'src/car-owner/car-owner.service';
import { User } from '../users/entities';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { TwilioService } from './otp_twilio/otp.service';
import { UserService } from 'src/users/users.service';
import { JwtPayload } from './interface/jwt-payload.interface';
import { Response as ExpressResponse } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mechanicService: MechanicService,
    private readonly carOwnerService: CarOwnerService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly twilioService: TwilioService,
    private readonly userService: UserService,
  ) {}

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

    const user = this.userRepository.create({
      name: userDto.name,
      email: userDto.email,
      phoneNumber: userDto.phone,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

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

    const jwtToken = await this.generateJwtToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(user.id, user.email);

    // Set cookies using the 'cookie' package
    const cookieOptions = {
      httpOnly: true,
    };

    response.cookie('refreshToken', refreshToken, cookieOptions);

    return { jwtToken, user };
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
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  async validateUserByJwt(payload: JwtPayload): Promise<any> {
    return this.userService.findById(payload.sub);
  }

  async validateUserByRefreshToken(payload: JwtPayload): Promise<any> {
    return this.userService.findById(payload.sub);
  }
}
