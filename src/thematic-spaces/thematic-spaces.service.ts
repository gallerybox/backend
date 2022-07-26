import { Injectable } from '@nestjs/common';
import { CreateThematicSpaceDto } from './dto/create-thematic-space.dto';
import { UpdateThematicSpaceDto } from './dto/update-thematic-space.dto';

@Injectable()
export class ThematicSpacesService {

  create(createThematicSpaceDto: CreateThematicSpaceDto) {
    return 'This action adds a new thematicSpace';
  }

  findAll() {
    return `This action returns all thematicSpaces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} thematicSpace`;
  }

  update(id: number, updateThematicSpaceDto: UpdateThematicSpaceDto) {
    return `This action updates a #${id} thematicSpace`;
  }

  remove(id: number) {
    return `This action removes a #${id} tehmaticSpace`;
  }
}
