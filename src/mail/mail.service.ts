import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';


@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService
    ) {}

    async sendUserWelcome(toEmail: string) {
        await this.mailerService.sendMail(
            {
            to: toEmail,
            from: "noreply@gallerybox.app",
            subject: 'Bienvenido a GalleryBox!',
            html: `<p>Hola, bienvenido a GalleryBox. Estamos encantados de verte por aquí. Estamos seguros de esta aplicación
                   te ayudará a gestionar todas tus colecciones.</p>`
            
        });
    }


    async sendPlainTextEmail(toEmail: string, fromEmail: string, subject: string, text: string, attachments?) {
        
        return await this.mailerService.sendMail({
            to: toEmail,
            from: fromEmail,
            subject: subject,
            html: text,
            attachments: attachments
        });
    }
}