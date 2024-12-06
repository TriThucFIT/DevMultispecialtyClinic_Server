import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MedicalRecordSumary } from './types';

@Injectable()
export class CustomMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Welcome to Our Service!',
        template: './welcome',
        context: {
          name,
        },
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendMedicalSummary(to: string, record: MedicalRecordSumary) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Tóm Tắt Y Khoa của Bạn',
        template: './medical_summary',
        context: record,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
