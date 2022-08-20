import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService
    ) {}

    @Get(":userId")
    async sendPersonalData(@Param("userId") userId: string) {
        return this.profileService.sendPersonalData(userId);
    }
}
