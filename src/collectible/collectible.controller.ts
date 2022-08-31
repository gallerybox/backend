import {Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, UploadedFiles, UseGuards} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CollectibleService } from './collectible.service';
import {Collectible} from "./models/Collectible";

@Controller('collectible')
export class CollectibleController {

  constructor(
    private readonly collectibleService: CollectibleService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(AnyFilesInterceptor())
  async createCollectible(@Req() request: Request, @UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.collectibleService.create(request.body, files);
  }

  @Get('timeline/loggedUserId/:loggedUserId')
  async getTimeline(@Param('loggedUserId') loggedUserId: string) {
    return await this.collectibleService.getTimeline(loggedUserId);
  }

  @Get('timeline/thematicSpaceId/:thematicSpaceId')
  async getTimelineByThematicSpaceId(@Param('thematicSpaceId') thematicSpaceId: string){
    return await this.collectibleService.getTimelineByThematicSpaceId(thematicSpaceId);
  }
  
  @Get()
  async findAll() {
    return await this.collectibleService.findAll();
  }
  
  //@UseGuards(JwtAuthGuard)
  @Get('id/:id')
  async findOne(@Param('id') id: string) {
    return await this.collectibleService.findOne(id);
  }

  @Get('userId/:id')
  async findByUserId(@Param('id') userId: string){
    return await this.collectibleService.findByUserId(userId);
  }

  @Get('thematic-space/:thematicSpaceId')
  async findAllByThematicSpaceId(@Param('thematicSpaceId') thematicSpaceId: string){
    return await this.collectibleService.findAllByThematicSpace(thematicSpaceId);
  }
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update( @Body() collectible: Collectible ) {
    return await this.collectibleService.update(collectible);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.collectibleService.remove(id);
  }

  @Get('populate')
  async populate() {
    return await this.collectibleService.populate()
  }


}
