import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { ThematicSpace, ThematicSpaceDocument } from './models/ThematicSpace';
import { ThematicSpaceRepository } from './repositories/thematic-spaces.repository';

@Injectable()
export class ThematicSpacesService {
  constructor(
    private readonly thematicSpaceRepository: ThematicSpaceRepository,
    private readonly userService: UsersService,
    @InjectModel(ThematicSpace.name) private thematicSpaceModel: Model<ThematicSpaceDocument>,
  ) {}

  async getOwnedThematicSpaces(userId: string){
    // Paso 1: obtenemos el usuario de la base de datos
    const user = await this.userService.findOneById(userId);

    // Paso 2: sacamos sus espacios temáticos
    const thematicSpacesId = user.ownedThematicSpaces.map( thematicSpace => thematicSpace._id );

    // Paso 3: buscamos los espacios temáticos en la base de datos
    return await this.thematicSpaceRepository.getThematicSpacesByIds(thematicSpacesId);
  }

  async getFollowedThematicSpaces(userId: string) {
    // Paso 1: obtenemos el usuario de la base de datos
    const user = await this.userService.findOneById(userId);

    // Paso 2: sacamos sus espacios temáticos
    const thematicSpacesId = user.followedThematicSpaces.map( thematicSpace => thematicSpace._id );

    // Paso 3: buscamos los espacios temáticos en la base de datos
    return await this.thematicSpaceRepository.getThematicSpacesByIds(thematicSpacesId);
  }

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
    return this.thematicSpaceModel.find({}, { name: { "$regex": tag} }); 
  }
}
