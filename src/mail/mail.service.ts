// email.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
      socketTimeout: 30000,
    });

    this.setupTemplates();
  }

  private setupTemplates() {
    const handlebarOptions = {
      viewEngine: {
        extname: '.hbs',
        layoutsDir: 'src/mail/public',
        defaultLayout: 'reset-password',
      },
      viewPath: 'src/mail/public',
      extName: '.hbs',
    };

    this.transporter.use('compile', hbs(handlebarOptions));
  }

  async sendResetPasswordEmail(
    email: string,
    resetLink: string,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: '"MECAR" <no-reply@mailer.com>',
        to: email,
        subject: 'Reset Your Password',
        template: 'reset-password',
        context: {
          resetLink,
        },
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error: any) {
      console.error('Error sending reset password email:', error.message);
      throw error;
    }
  }
}
