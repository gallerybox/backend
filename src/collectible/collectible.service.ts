import { Inject, Injectable } from '@nestjs/common';
import { ThematicSpace } from 'src/thematic-spaces/models/ThematicSpace';
import { ThematicSpacesService } from 'src/thematic-spaces/thematic-spaces.service';
import { Users } from 'src/users/schema/users.schema';
import { UsersService } from 'src/users/users.service';
import { CreateCollectibleDto } from './dto/create-collectible.dto';
import { UpdateCollectibleDto } from './dto/update-collectible.dto';

@Injectable()
export class CollectibleService {

  constructor(
    private readonly userService: UsersService,
    private readonly thematicSpaceService: ThematicSpacesService
  ) {}

  async createCollection(body: any, files: Express.Multer.File[]) {
    let user: Users, thematicSpace: ThematicSpace;
    let userId: string, thematicSpaceId: string;
    let values: {[tag:string]: any} = {};

    Object.keys(body).forEach(async key => {
      if (key === "userId")
        userId = await body[key];
      else if (key === "thematicSpaceId")
        thematicSpaceId = body[key];
      else {
        values[key] = body[key];
      }
    });
    
    user = await this.userService.findOneById(userId);
    //thematicSpace = await this.thematicSpaceService.findOneById(thematicSpaceId);
    
    console.log(user);
    

    // console.log(myUser);
    // console.log(myUser);
    
    // console.log(values);
    /*
    let userId: string, thematicSpaceId: string, values: { [key: string]: any } = {};

    console.log(body);
    // Paso 1: persistir los ficheros en AWS S3 para obtener las urls.
    // Paso 2: preparar los atributos añadiendo las urls de los datos obtenidos en el paso 1
    // Paso 3: persistir el collectible

    // Paso 1: Comprobamos si se recibe algún fichero. Si todo Ok, envía los ficheros a AWS S3.
    const fileData = files.length > 0 ? await this.filesService.uploadFiles(files) : null;

    // Paso 2: preparación de los atributos del collectible
    Object.keys(body).forEach(key => {
      if (key === "userId")
        userId = body[key];
      else if (key === "thematicSpaceId")
        thematicSpaceId = body[key];
      else{
        // Object.add(values, { "": body[key] })

        // values = body[key];
        // values[key] = body[key];
        // console.log(key);
      }
    
    });
    
    console.log(values)

    // let collectible = new Collectible(userId, thematicSpaceId,)

    // console.log("userId: " + userId);
    // console.log("thematicSpaceId: " + thematicSpaceId);
    
    // console.log(userId);
    //const userId = Object.fromEntries(Object.entries(body)).userId;
    //const thematicSpaceId = Object.fromEntries(Object.entries(body)).thematicSpaceId;
    

    if (fileData) {
      
    }
    */
  
  }

  create(createCollectibleDto: CreateCollectibleDto) {
    return 'This action adds a new collectible';
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
