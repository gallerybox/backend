import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { UsersService } from './users.service';

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
    async createCollection( @Body() createCollectionDto: CreateCollectionDto) {
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
        console.log("entra qui");
        console.log(spaceId);
        return this.usersService.findUserOwnerOfSpaceId( spaceId );
    }

    // @UseGuards(JwtAuthGuard)
    @Get('/all')
    findAll(){
        return this.usersService.findAll();
    }
    
    // @UseGuards(JwtAuthGuard)
    @Patch(':id')
    updateById(@Param('id') id: string, @Body() updateUsersDto: UpdateUsersDto) {
        return this.usersService.update(id, updateUsersDto);
    }
    
    // @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.usersService.deleteOne(id);
    }
}
