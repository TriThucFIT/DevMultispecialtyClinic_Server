import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { EmailController } from './MailerModule.controller';
import { CustomMailerService } from './MailerModule.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: configService.get('MAIL_PORT'),
          secure: configService.get('MAIL_SECURE') === 'true',
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASS'),
          },
          tls: {
            ciphers: 'SSLv3',
          },
        },
        defaults: {
          from: `"Phòng Khám Đa Khoa DMC" <${configService.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, '../templates/emails'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [EmailController],
  providers: [CustomMailerService],
  exports: [MailerModule, CustomMailerService],
})
export class MailerCustomModule {}
