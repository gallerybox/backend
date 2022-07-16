import { Injectable } from '@nestjs/common';
import { CreateTematicSpaceDto } from './dto/create-tematic-space.dto';
import { UpdateTematicSpaceDto } from './dto/update-tematic-space.dto';

@Injectable()
export class TematicSpacesService {
  create(createTematicSpaceDto: CreateTematicSpaceDto) {
    return 'This action adds a new tematicSpace';
  }

  findAll() {
    return `This action returns all tematicSpaces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tematicSpace`;
  }

  update(id: number, updateTematicSpaceDto: UpdateTematicSpaceDto) {
    return `This action updates a #${id} tematicSpace`;
  }

  remove(id: number) {
    return `This action removes a #${id} tematicSpace`;
  }
}
