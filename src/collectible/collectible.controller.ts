import {Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, UploadedFiles} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CollectibleService } from './collectible.service';

@Controller('collectible')
export class CollectibleController {

  constructor(
    private readonly collectibleService: CollectibleService
  ) {}

  @Post('create')
  @UseInterceptors(AnyFilesInterceptor())
  async createCollection(@Req() request: Request, @UploadedFiles() files: Array<Express.Multer.File>) {
    await this.collectibleService.create(request.body, files);
  }

  @Get()
  async findAll() {
    return await this.collectibleService.findAll();
  }

  // TODO (Este método no tiene mucho sentido)
  @Get('id/:id')
  async findOne(@Param('id') id: string) {
    return await this.collectibleService.findOne(id);
  }

  @Get('thematic-space/:thematicSpaceId')
  async findAllByThematicSpace(@Param('thematicSpaceId') thematicSpaceId: string){
    return await this.collectibleService.findAllByThematicSpace(thematicSpaceId);
  }

  // TODO: - collectibleController - Update
  @Patch(':id')
  async update(@Param('id') id: string /*, @Body() updateCollectibleDto: UpdateCollectibleDto*/) {
    return await this.collectibleService.update(id/*, updateCollectibleDto*/);
  }

  // TODO: - collectibleController - Remvoe
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.collectibleService.remove(id);
  }

  @Get('tests/:thematicSpaceId')
  async tests(@Param('thematicSpaceId') thematicSpaceId: string) {

    // let space: ThematicSpace = (await this.thematicSpaceRepository.find({_id: thematicSpaceId}))[0];
    // console.log(space);

    // let collectible: Collectible = new Collectible(space, {"My silly attribute TAG": "Valor dinámico de prueba"});

    // collectible = await this.collectibleRepository.add(collectible);

    // return collectible;


  }


}
