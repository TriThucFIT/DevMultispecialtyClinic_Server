import { Controller, Post, Body } from '@nestjs/common';
import { CustomMailerService } from './MailerModule.service';

@Controller('email')
export class EmailController {
  constructor(private readonly mailerService: CustomMailerService) {}

  @Post('send')
  async sendEmail(@Body() body: { email: string; name: string }) {
    const { email, name } = body;
    await this.mailerService.sendWelcomeEmail(email, name);
    return { message: 'Email sent successfully!' };
  }
}
