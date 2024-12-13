import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MedicalRecordSumary } from './types';
import { AppointmentComfirmation } from './types/Appointment.type';

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

  async sendAppointmentConfirmation(
    to: string,
    record: AppointmentComfirmation,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Xác Nhận Đặt Lịch Hẹn',
        template: './appointment_confirmation',
        context: {
          ...record,
          service: {
            ...record.service,
            price: this.formatCurrency(record.service.price),
          },
        },
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendResetPasswordEmail(
    to: string,
    data: { name: string; temporaryPassword: string },
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Xác Nhận Đặt Lại Mật Khẩu',
        template: './reset_password',
        context: data,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }
}
