import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CollectibleService } from './collectible.service';
import { CreateCollectibleDto } from './dto/create-collectible.dto';
import { UpdateCollectibleDto } from './dto/update-collectible.dto';

@Controller('collectible')
export class CollectibleController {
  constructor(private readonly collectibleService: CollectibleService) {}

  @Post()
  create(@Body() createCollectibleDto: CreateCollectibleDto) {
    return this.collectibleService.create(createCollectibleDto);
  }

  @Get()
  findAll() {
    return this.collectibleService.findAll();
  }

  @Get(':id')
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
}
