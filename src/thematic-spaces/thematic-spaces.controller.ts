import {Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ThematicSpacesService } from './thematic-spaces.service';
import {ThematicSpace} from "./models/ThematicSpace";

@Controller('thematic-spaces')
export class ThematicSpacesController {

  constructor(
    private readonly thematicSpacesService: ThematicSpacesService,
  ) {}

  @Get('follow-space/:userId/:thematicSpaceId')
  async followSpaceByUserId(
      @Param('userId') userId: string,
      @Param('thematicSpaceId') thematicSpaceId: string
  ) {
      return await this.thematicSpacesService.followSpaceByUserId(userId, thematicSpaceId);
  }

  @Get('id/:id')
  async findOneById(@Param('id') id: string) {
    return await this.thematicSpacesService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async upsert(@Body() thematicSpace: ThematicSpace) {
    return await this.thematicSpacesService.create(thematicSpace);
  }

  @Get("populate")
  async populate(){
    return await this.thematicSpacesService.populate();
  }

}
