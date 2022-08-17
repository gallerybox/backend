import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
          
          // Mail Server Configuration
          
          MAIL_HOST: Joi.string().required(),
          MAIL_USER: Joi.string().required(),
          MAIL_PASSWORD: Joi.string().required(),
          MAIL_FROM: Joi.string().required(),
          MAIL_TRANSPORT: Joi.string().required()
      }),
      envFilePath: '.env'
    }),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
          transport: {
              host: configService.get<string>('MAIL_HOST'),
              auth: {
                  user: configService.get<string>('MAIL_USER'),
                  pass: configService.get<string>('MAIL_PASSWORD')
              }
          },
          defaults: {
              from: `No reply <${configService.get<string>('MAIL_FROM')}>`
          }
      }), inject: [ConfigService] 
  })
  ],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController]
})
export class MailModule {}
