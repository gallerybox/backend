import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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
    create(@Body() createUsersDto: CreateUsersDto) {
        return this.usersService.create(createUsersDto);
    }

    // @UseGuards(JwtAuthGuard) 
    @Get('/id/:id')
    findOneById(@Param('id') id: string) {
        return this.usersService.findOneById(id);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('/nickname/:nickname')
    findOneByNickname(@Param('nickname') nickname: string) {
        return this.usersService.findOneByNickname(nickname);
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
