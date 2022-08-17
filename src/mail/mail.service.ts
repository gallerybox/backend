import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService
    ) {}

    async sendUserWelcome(
        toEmail: string
    ) {
        console.log(toEmail)
        await this.mailerService.sendMail({
            to: 'utri1990@gmail.com',
            subject: 'Welcome to GalleryBox!',
            template: './templates/welcome',
            context: {
                name: 'The fucking Yisus'
            }
        });
    }


    async sendPlainTextEmail(toEmail: string, fromEmail: string, subject: string, text: string,
    ) {
        return await this.mailerService.sendMail({
            to: toEmail,
            from: fromEmail,
            subject: subject,
            html: text,
            
        });
    }
}