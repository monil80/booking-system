import { Injectable } from '@nestjs/common';
import { MailtrapClient } from 'mailtrap';

@Injectable()
export class MailService {
  private client;

  constructor() {
    this.client = new MailtrapClient({
      token: process.env.MAILTRAP_TOKEN || '1c9cf',
    });
  }

  async sendVerificationEmail(toEmail: string, token: string) {
    const sender = {
      email: 'hello@demomailtrap.co',
      name: 'Mailtrap Test',
    };

    const recipients = [{ email: toEmail }];

    const verifyUrl = `${process.env.MAILTRAP_TOKEN}/verify?token=${token}`;

    try {
      await this.client.send({
        from: sender,
        to: recipients,
        subject: 'Verify Your Email',
        text: `Click here to verify your email: ${verifyUrl}`,
        category: 'Email Verification',
      });
      return true
    } catch (error) {
      console.error('Failed to send email:', error);
       return false;
    }
  }
}
