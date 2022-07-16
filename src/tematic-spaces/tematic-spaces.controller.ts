import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TematicSpacesService } from './tematic-spaces.service';
import { CreateTematicSpaceDto } from './dto/create-tematic-space.dto';
import { UpdateTematicSpaceDto } from './dto/update-tematic-space.dto';

@Controller('tematic-spaces')
export class TematicSpacesController {
  constructor(private readonly tematicSpacesService: TematicSpacesService) {}

  @Post()
  create(@Body() createTematicSpaceDto: CreateTematicSpaceDto) {
    return this.tematicSpacesService.create(createTematicSpaceDto);
  }

  @Get()
  findAll() {
    return this.tematicSpacesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tematicSpacesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTematicSpaceDto: UpdateTematicSpaceDto) {
    return this.tematicSpacesService.update(+id, updateTematicSpaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tematicSpacesService.remove(+id);
  }
}
