import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const mailFactory = async (configService: ConfigService) => {
  return {
    transport: {
      host: configService.get<string>('MAIL_HOST'),
      port: configService.get<number>('MAIL_PORT'),
      ignoreTLS: true,
      secure: true,
      auth: {
        user: configService.get<string>('MAIL_USER'),
        pass: configService.get<string>('MAIL_PASSWORD'),
      },
    },
    defaults: {
      from: '"No Reply" <no-reply@localhost>',
    },
    template: {
      dir: process.cwd() + '/src/mail/templates/',
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
};
