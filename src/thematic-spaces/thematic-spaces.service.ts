import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ThematicSpace, ThematicSpaceDocument } from './models/ThematicSpace';
import { ThematicSpaceRepository } from './repositories/ThematicSpaceRepository';

@Injectable()
export class ThematicSpacesService {

  constructor(
    private readonly thematicSpaceRepository: ThematicSpaceRepository,
    @InjectModel(ThematicSpace.name) private thematicSpaceModel: Model<ThematicSpaceDocument>,
  ) {}

  async create() {
    // return await this.thematicSpaceRepository.create(createThematicSpaceDto);
  }

  async findAll() {
    return await this.thematicSpaceRepository.find({});
  }

  async findOneById(id: string) {
    return await this.thematicSpaceRepository.findOne({ _id: id });
  }

  async update(id: string /**, Faltan los datos  */) {
    // return await this.thematicSpaceRepository.add();
  }

  async remove(id: string) {
    return await this.thematicSpaceRepository.delete( { _id: id } );
  }
}
