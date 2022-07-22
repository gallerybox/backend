import {Controller, Get, Post, Body, Patch, Param, Delete, Inject} from '@nestjs/common';
import { CollectibleService } from './collectible.service';
import { CreateCollectibleDto } from './dto/create-collectible.dto';
import { UpdateCollectibleDto } from './dto/update-collectible.dto';
import {Collectible} from "./models/Collectible";
import {Template} from "../tematic-spaces/models/Template";
import {ThematicSpaceRepository} from "../tematic-spaces/repositories/ThematicSpaceRepository";
import {ThematicSpace} from "../tematic-spaces/models/ThematicSpace";
import {CollectibleRepository} from "./repositories/CollectibleRepository";

@Controller('collectible')
export class CollectibleController {

  @Inject()
  thematicSpaceRepository: ThematicSpaceRepository;

  @Inject()
  collectibleRepository: CollectibleRepository;


  constructor(private readonly collectibleService: CollectibleService) {}

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

  @Get('tests/:tematicSpaceId')
  async tests(@Param('tematicSpaceId') tematicSpaceId: string) {

    let space: ThematicSpace = (await this.thematicSpaceRepository.find({_id: tematicSpaceId}))[0];
    console.log(space);

    let collectible: Collectible = new Collectible(space, {"My silly attribute TAG": "Valor dinámico de prueba"});

    collectible = await this.collectibleRepository.add(collectible);

    return collectible;


  }


}
