import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AttributeRepository } from 'src/attribute/attribute.repository';
import { Attribute, AttributeDocument } from './models/Attribute';
import { ThematicSpace, ThematicSpaceDocument } from './models/ThematicSpace';
import { ThematicSpaceRepository } from './repositories/thematic-spaces.repository';

@Injectable()
export class ThematicSpacesService {

  constructor(
    private readonly thematicSpaceRepository: ThematicSpaceRepository,
    private readonly attributeRepository: AttributeRepository,
    @InjectModel(ThematicSpace.name) private thematicSpaceModel: Model<ThematicSpaceDocument>,
    @InjectModel(Attribute.name) private attributeModel: Model<AttributeDocument>
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

  async update(id: string, thematicSpace: ThematicSpace) {
    return await this.thematicSpaceRepository.findOneAndUpdate( { _id: id }, thematicSpace );
  }

  async remove(id: string) {
    return await this.thematicSpaceRepository.delete( { _id: id } );
  }

  async removeByTag(tag: string) {
    // const query = this.thematicSpaceModel.find({ _id: '62daca441334ad9783770397' }).where()
    // return this.thematicSpaceRepository.find( { name: { "$regex": "Testing"} });
    return this.thematicSpaceModel.find({}, { name: { "$regex": "Testing"} }); 
    // return await this.thematicSpaceRepository.find({});
  }
}
