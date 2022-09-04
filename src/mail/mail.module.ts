import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import {MailerModule} from "@nestjs-modules/mailer";
import {BullModule} from "@nestjs/bull";
import {MailProcessor} from "./mail.processor";

@Module({
  imports: [
      MailerModule.forRootAsync({
        useFactory: async (configService: ConfigService) => ({
          transport: {
            host: configService.get('MAIL_HOST'),
            secure: false,
            auth: {
              user: configService.get('MAIL_USER'),
              pass: configService.get('MAIL_PASSWORD'),
            },
          },
          defaults: {
            from: `"No Reply" <${configService.get('MAIL_FROM')}>`,
          },
          template: {
            dir: join(__dirname, '../mail/templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        }),
        inject: [ConfigService],
      }),
      BullModule.registerQueueAsync({
        name: 'sendMail',
        useFactory: async (configService: ConfigService) => ({
          redis: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        }),
        inject: [ConfigService],
      }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
