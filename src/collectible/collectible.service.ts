import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { ThematicSpace } from 'src/thematic-spaces/models/ThematicSpace';
import { ThematicSpacesService } from 'src/thematic-spaces/thematic-spaces.service';
import { Users } from 'src/users/schema/users.schema';
import { UsersService } from 'src/users/users.service';
import { UpdateCollectibleDto } from './dto/update-collectible.dto';
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
    let user: Users, thematicSpace: ThematicSpace;
    let s3UploadedFiles;
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

    user = await this.userService.findOneById(userId);
    thematicSpace = await this.thematicSpaceService.findOneById( thematicSpaceId );
    
    let collectible: Collectible = new Collectible(user, thematicSpace, values);
    collectible.name = "Test JUANCA";
    
    return await this.collectibleRepository.add(collectible);
  }

  findAll() {
    return `This action returns all collectible`;
  }

  findOne(id: number) {
    return `This action returns a #${id} collectible`;
  }

  update(id: number, updateCollectibleDto: UpdateCollectibleDto) {
    return `This action updates a #${id} collectible`;
  }

  remove(id: number) {
    return `This action removes a #${id} collectible`;
  }
}
