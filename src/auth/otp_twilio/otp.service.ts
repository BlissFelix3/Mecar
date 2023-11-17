import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class TwilioService {
  private twilioClient: Twilio;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const accountSid = configService.get('TWILIO_ACCOUNT_SID');
    const authToken = configService.get('TWILIO_AUTH_TOKEN');

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  getHello(): string {
    return 'Hello World!';
  }

  async sendOtp(
    user: User,
  ): Promise<{ message: string; verificationSid: string }> {
    try {
      const serviceSid = this.configService.get(
        'TWILIO_VERIFICATION_SERVICE_SID',
      );

      const verification = await this.twilioClient.verify.v2
        .services(serviceSid)
        .verifications.create({ to: user.phoneNumber, channel: 'sms' });

      return {
        message: 'OTP sent successfully',
        verificationSid: verification.sid,
      };
    } catch (error: any) {
      throw new BadRequestException(
        'Failed to send OTP. Phone number not registered',
      );
    }
  }

  async verifyOtp(
    user: User,
    code: string,
    verificationSid: string,
  ): Promise<void> {
    try {
      const serviceSid = this.configService.get(
        'TWILIO_VERIFICATION_SERVICE_SID',
      );
      const verificationCheck = await this.twilioClient.verify.v2
        .services(serviceSid)
        .verificationChecks.create({
          to: user.phoneNumber,
          code,
          verificationSid,
        });

      if (verificationCheck.status !== 'approved') {
        throw new Error('Wrong Verification code');
      }
      // Updating verification status
      user.isPhoneVerified = true;
      await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Wrong Code');
    }
  }
}