import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import { ProfileService } from './profile.service';
import {Users} from "../users/schema/users.schema";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";

@Controller('profile')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService
    ) {}


    @Get(":userId")
    async sendPersonalData(@Param("userId") userId: string) {
        return this.profileService.sendPersonalData(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/update-user-collectible')
    async updateUserCollection(
        @Body() updatePersonalDataDto: Users
    ) {
        return await this.profileService.upsertDeleteCollectibles(updatePersonalDataDto);
    }
}
