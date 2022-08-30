import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import { ProfileService } from './profile.service';
import {Users} from "../users/schema/users.schema";

@Controller('profile')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService
    ) {}

    @Get(":userId")
    async sendPersonalData(@Param("userId") userId: string) {
        return this.profileService.sendPersonalData(userId);
    }

    @Post('/update-user-collectible')
    async updateUserCollection(
        @Body() updatePersonalDataDto: Users
    ) {
        return await this.profileService.upsertDeleteCollectibles(updatePersonalDataDto);
    }
}
