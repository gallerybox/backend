import {Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req} from '@nestjs/common';
import { ThematicSpacesService } from './thematic-spaces.service';
import { Request } from 'express';
import {CreateUsersDto} from "../users/dto/create-users.dto";
import {ThematicSpace} from "./models/ThematicSpace";

@Controller('thematic-spaces')
export class ThematicSpacesController {

  constructor(
    private readonly thematicSpacesService: ThematicSpacesService,
  ) {}

  @Get('owned/:userId')
  async getOwnedThematicSpaces(@Param('userId') userId: string) {
    return await this.thematicSpacesService.getOwnedThematicSpaces(userId);
  }

  @Get('participated/:userId')
  async getFollowedThematicSpaces(@Param('userId') userId: string) {
    return await this.thematicSpacesService.getFollowedThematicSpaces(userId);
  }

  @Get()
  async findAll() {
    return await this.thematicSpacesService.findAll();
  }

  @Get('id/:id')
  async findOneById(@Param('id') id: string) {
    return await this.thematicSpacesService.findOneById(id);
  }

  @Get('name/:name')
  async findOneByName(@Param('name') name: string) {
    return await this.thematicSpacesService.findOneByName(name);
  }

  @Post()
  async upsert(@Body() thematicSpace: ThematicSpace) {
    return await this.thematicSpacesService.create(thematicSpace);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.thematicSpacesService.remove(id);
  }


  @Get("populate")
  async populate(){
    return await this.thematicSpacesService.populate();
  }

}
