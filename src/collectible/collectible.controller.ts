import {Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, UploadedFiles} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CollectibleService } from './collectible.service';
import { CreateCollectibleDto } from './dto/create-collectible.dto';
import { UpdateCollectibleDto } from './dto/update-collectible.dto';

@Controller('collectible')
export class CollectibleController {

  constructor(
    private readonly collectibleService: CollectibleService
  ) {}

  @Post('create-collectible')
  @UseInterceptors(AnyFilesInterceptor())
  async createCollection(@Req() request: Request, @UploadedFiles() files: Array<Express.Multer.File>) {
    await this.collectibleService.createCollection(request.body, files);
  }

  @Post()
  create(@Body() createCollectibleDto: CreateCollectibleDto) {
    return this.collectibleService.create(createCollectibleDto);
  }

  @Get()
  findAll() {
    return this.collectibleService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.collectibleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCollectibleDto: UpdateCollectibleDto) {
    return this.collectibleService.update(+id, updateCollectibleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectibleService.remove(+id);
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
