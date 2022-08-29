import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdatePersonalDataDto } from './dto/update-personaldata.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { UsersService } from './users.service';
import {Users} from "./schema/users.schema";

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    // @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createUsersDto: CreateUsersDto) {
        return await this.usersService.create(createUsersDto);
    }

    @Post('create-collection')
    async createCollection(@Body() createCollectionDto: CreateCollectionDto) {
        return await this.usersService.createCollection(createCollectionDto);
    }

    @Get('collection/:collectionId')
    async findAllByCollectionId(@Param('collectionId') collectionId: string) {
      return await this.usersService.findAllByCollectionId(collectionId);
    }

    // @UseGuards(JwtAuthGuard) 
    @Get('/id/:id')
    findOneById(@Param('id') id: string) {
        return this.usersService.findOneById(id);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('/followed-user/:id')
    findUserByFollowedUserId(@Param('id') id: string) {
        return this.usersService.findUserByFollowedUserId(id);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('/nickname/:nickname')
    findOneByNickname(@Param('nickname') nickname: string) {
        return this.usersService.findOneByNickname(nickname);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('/followed-space-id/:spaceId')
    findUsersByFollowedSpaceId(@Param('spaceId') spaceId: string) {
        return this.usersService.findUsersByFollowedSpaceId(spaceId);
    }
    @Get('/owned-space-id/:spaceId')
    findUserOwnerOfSpaceId(@Param('spaceId') spaceId: string){
        console.log(spaceId);
        return this.usersService.findUserOwnerOfSpaceId( spaceId );
    }

    @UseGuards(JwtAuthGuard)
    @Get('/all')
    findAll(){
        return this.usersService.findAll();
    }

    // @UseGuards(JwtAuthGuard)
    @Patch(':id')
    updateById(@Param('id') id: string, @Body() updateUsersDto: UpdateUsersDto) {
        return this.usersService.update(id, updateUsersDto);
    }

    // Personal data management
    
    @Post('add-avatar')
    @UseInterceptors(FileInterceptor('file'))
    async addAvatar(@Req() request: Request, @UploadedFile() file: Express.Multer.File) {
        return await this.usersService.addAvatar(request.body.userId, file);
    }

    @Delete('delete-avatar/:userId')
    async deleteAvatar(@Param('userId') userId: string){
        return await this.usersService.deleteAvatar(userId);
    }

    @Patch('/personal-data/:userId')
    async updatePersonalData(
        @Param('userId') userId: string,
        @Body() updatePersonalDataDto: UpdatePersonalDataDto
    ) {
        return await this.usersService.update(userId, updatePersonalDataDto);
    }


    @Post('/prueba/')
    async updateUserCollection(
        @Body() updatePersonalDataDto: Users
    ) {
        return await this.usersService.upsertDeleteCollectibles(updatePersonalDataDto);
    }

    upsertDeleteCollectibles
    
    @Get("find-email/:email")
    async findEmail (@Param("email") email: string){
        return await this.usersService.findOneByEmail(email);
    }


    // @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') userId: string) {
        console.log("ENTRO EN BORRAR")
        // TODO: borrar todos los datos de Amazon S3 asociados al usuario.
        return this.usersService.deleteOne(userId);
    }

    @Get('change-follow-user/:userId/:userIdToChange/:isFollowed')
    async changeFollowUser(
        @Param('userId') userId: string,
        @Param('userIdToChange') userIdToChange: string,
        @Param('isFollowed') isFollowed: string)
    {
        return await this.usersService.changeFollowUser(userId, userIdToChange, isFollowed);
    }
}
