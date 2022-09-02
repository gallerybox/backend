import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePersonalDataDto } from './dto/update-personaldata.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { UsersService } from './users.service';
import {Users} from "./schema/users.schema";

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get('collection/:collectionId')
    async findAllByCollectionId(@Param('collectionId') collectionId: string) {
      return await this.usersService.findAllByCollectionId(collectionId);
    }

    @Get('/id/:id')
    findOneById(@Param('id') id: string) {
        return this.usersService.findOneById(id);
    }

    @Get('/followed-user/:id')
    findUserByFollowedUserId(@Param('id') id: string) {
        return this.usersService.findUserByFollowedUserId(id);
    }

    @Get('/followed-space-id/:spaceId')
    findUsersByFollowedSpaceId(@Param('spaceId') spaceId: string) {
        return this.usersService.findUsersByFollowedSpaceId(spaceId);
    }
    @Get('/owned-space-id/:spaceId')
    findUserOwnerOfSpaceId(@Param('spaceId') spaceId: string){
        console.log(spaceId);
        return this.usersService.findUserOwnerOfSpaceId( spaceId );
    }

    // Personal data management
    @UseGuards(JwtAuthGuard)
    @Post('add-avatar')
    @UseInterceptors(FileInterceptor('file'))
    async addAvatar(@Req() request: Request, @UploadedFile() file: Express.Multer.File) {
        return await this.usersService.addAvatar(request.body.userId, file);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete-avatar/:userId')
    async deleteAvatar(@Param('userId') userId: string){
        return await this.usersService.deleteAvatar(userId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Patch('/personal-data/:userId')
    async updatePersonalData(
        @Param('userId') userId: string,
        @Body() updatePersonalDataDto: UpdatePersonalDataDto
    ) {
        return await this.usersService.update(userId, updatePersonalDataDto);
    }


    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') userId: string) {
        console.log("ENTRO EN BORRAR")
        // TODO: borrar todos los datos de Amazon S3 asociados al usuario.
        return this.usersService.deleteOne(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('change-follow-user/:userId/:userIdToChange/:isFollowed')
    async changeFollowUser(
        @Param('userId') userId: string,
        @Param('userIdToChange') userIdToChange: string,
        @Param('isFollowed') isFollowed: string)
    {
        return await this.usersService.changeFollowUser(userId, userIdToChange, isFollowed);
    }
}
