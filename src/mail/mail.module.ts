import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [MailService, ConfigService],
  controllers: [MailController],
})
export class MailModule {}
