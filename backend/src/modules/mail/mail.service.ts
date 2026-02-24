import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const url = `${process.env.URL_BACKEND}/auth/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verifikasi Email Akun Qifaya Kamu',
      template: 'verify-email',
      context: {
        name,
        url,
      },
    });
  }

  async resendEmailVerification(email: string, name: string, token: string) {
    const url = `${process.env.URL_BACKEND}/auth/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Kirim Ulang Verifikasi Email Qifaya',
      template: 'verify-email',
      context: {
        name,
        url,
      },
    });
  }

  async sendForgotPasswordEmail(email: string, name: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password OTP - Qifaya',
      template: 'forgot-password',
      context: {
        name,
        otp,
      },
    });
  }
}
