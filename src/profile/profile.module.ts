import { Module } from '@nestjs/common';
import { CollectibleModule } from 'src/collectible/collectible.module';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/users/users.module';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
    imports: [
        MailModule,
        UsersModule,
        CollectibleModule,
        MailModule
    ],
    providers: [
        ProfileService
    ],
    controllers: [ProfileController]
})
export class ProfileModule {}
