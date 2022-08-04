import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { ThematicSpace } from 'src/thematic-spaces/models/ThematicSpace';
import { ThematicSpacesService } from 'src/thematic-spaces/thematic-spaces.service';
import { Users } from 'src/users/schema/users.schema';
import { UsersService } from 'src/users/users.service'
import { Collectible, CollectibleDocument } from './models/Collectible';
import { CollectibleRepository } from './repositories/CollectibleRepository';

@Injectable()
export class CollectibleService {

  constructor(
    private readonly userService: UsersService,
    private readonly thematicSpaceService: ThematicSpacesService,
    private readonly filesService: FilesService,
    private readonly collectibleRepository: CollectibleRepository,
    @InjectModel(Collectible.name) private collectibleModel: Model<CollectibleDocument>
  ) {}

  async create(body: any, files: Express.Multer.File[]) {
    let user: Users, thematicSpace: ThematicSpace, s3UploadedFiles;
    let userId: string, thematicSpaceId: string;
    let values: {[tag:string]: any} = {};

    Object.keys(body).forEach(async function (key) {
      if (key === "userId")
        userId = body[key];
      else if (key === "thematicSpaceId")
        thematicSpaceId = body[key]
      else
        values[key] = body[key];
    });

    // Si hay ficheros, los sube a AWS S3 y guarda las URL en values(attributes)
    if (files){
      s3UploadedFiles = await this.filesService.uploadFiles(files);
      s3UploadedFiles.forEach(s3File => {
        values[s3File.Fieldname] = s3File.Location
      });
    }
    console.log(values);

    user = await this.userService.findOneById(userId);
    console.log("User: " + user._id);
    thematicSpace = await this.thematicSpaceService.findOneById( thematicSpaceId );
    
    let collectible: Collectible = new Collectible(user, thematicSpace, values);
    collectible.name = "Test JUANCA";
    
    return await this.collectibleRepository.create(collectible);
  }

  async findByUserId(userId: string) {
    return await this.collectibleRepository.find( { userId: userId })
  }

  async findAll() {
    return await this.collectibleRepository.find({});
  }

  async findAllByThematicSpace(id: string) {
    return await this.collectibleRepository.find({ thematicSpace: id })
  }

  async findOne(id: string) {
    return await this.collectibleRepository.find( { _id: id });
  }

  async getTimeline(loggedUserId: string) {
    // userIds: Array<string>, thematicSpaceIds: Array<string>
    let user = await this.userService.findOneById(loggedUserId); 
    let userIds = user.followedUsers.map(user => user._id.toString());
    
    let x = user.followedThematicSpaces.map(thematicSpace => thematicSpace._id.toString())
    let y = user.ownedThematicSpaces.map(thematicSpace => thematicSpace._id.toString())
    let unifiedThematicSpaces = x.concat(y);

    console.log(unifiedThematicSpaces);
    return await this.collectibleRepository.getTimeline(userIds, unifiedThematicSpaces);
  }

  // TODO: - collectibleService - Update
  async update(id: string, /*updateCollectibleDto: UpdateCollectibleDto*/) {
    // return await this.collectibleRepository.remove()
  }

  async findOneAndDelete(id: string){
    return await this.collectibleRepository.findOneAndDelete( { _id: id });
  }

  async remove(id: string) {
    return await this.collectibleRepository.delete( {_id: id })
  }
}
