import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { ThematicSpace } from 'src/thematic-spaces/models/ThematicSpace';
import { ThematicSpacesService } from 'src/thematic-spaces/thematic-spaces.service';
import { CreateCollectionDto } from 'src/users/dto/create-collection.dto';
import { UpdateUsersDto } from 'src/users/dto/update-users.dto';
import { Collection, Users } from 'src/users/schema/users.schema';
import { UsersService } from 'src/users/users.service'
import { Collectible, CollectibleDocument } from './models/Collectible';
import { CollectibleRepository } from './repositories/collectible.repository';

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

  async getTimelineByThematicSpaceId(thematicSpaceId: string) {
    return await this.collectibleRepository.getTimelineByThematicSpaceId(thematicSpaceId);
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

  async populate() {
    let createdCollectibles: Array<Collectible> = new Array<Collectible>();

    let thematicSpaceCervezas = await this.thematicSpaceService.findOneByName("Cervezas del mundo");
    let user1_db = await this.userService.findOneByNickname("utrilla");

    let thematicSpaceVideojuegos = await this.thematicSpaceService.findOneByName("Videojuegos");
    let user2_db = await this.userService.findOneByNickname("pedrolo");
    
    let thematicSpaceMusica = await this.thematicSpaceService.findOneByName("Mi musicon");
    let user3_db = await this.userService.findOneByNickname("jesus");

    /*****************************************************************************
    *                             Coleccionables                                 *
    *****************************************************************************/

    // --------- Espacio temático: Cervezas del mundo, Usuario: utrilla ---------

    let values_collectible1: {[tag:string]: any} = {
      "Nombre": "Cruzcampo Gran Seleccion",
      "Graduacion": "7",
      "Tipo": "Rubia"
    };
    let collectible1 = new Collectible(user1_db, thematicSpaceCervezas, values_collectible1);
    const collectible1_db = await this.collectibleRepository.create(collectible1);
    createdCollectibles.push(collectible1_db);

    
    let values_collectible2: {[tag:string]: any} = {
      "Nombre": "Alhambra Reserva 1925",
      "Graduacion": "6.4",
      "Tipo": "Pilsen"
    };
    let collectible2 = new Collectible(user1_db, thematicSpaceCervezas, values_collectible2);
    const collectible2_db = await this.collectibleRepository.create(collectible2);
    createdCollectibles.push(collectible2_db);

    let values_collectible3: {[tag:string]: any} = {
      "Nombre": "Alhambra Reserva Roja",
      "Graduacion": "7.3",
      "Tipo": "Bock"
    };
    let collectible3 = new Collectible(user1_db, thematicSpaceCervezas, values_collectible3);
    const collectible3_db = await this.collectibleRepository.create(collectible3);
    createdCollectibles.push(collectible3_db);

    let values_collectible4: {[tag:string]: any} = {
      "Nombre": "Alhambra Singular",
      "Graduacion": "5.4",
      "Tipo": "Pale Lager"
    };
    let collectible4 = new Collectible(user1_db, thematicSpaceCervezas, values_collectible4);
    const collectible4_db = await this.collectibleRepository.create(collectible4);
    createdCollectibles.push(collectible4_db);


    // --------- Espacio temático: Videojuegos, Usuario: pedrolo ---------

    let values_collectible5: {[tag:string]: any} = {
      "Titulo": "Gravity Rush Remastered",
      "Descripcion": "Una versión mejorada del juego, Gravity Rush Remastered, fue lanzada en Japón " + 
                     "a finales de 2015 y en Europa y Norteamérica a inicios de 2016 para PlayStation 4.",
      "Distribuidora": "Sony Interactive Entertainment"
    };
    let collectible5 = new Collectible(user2_db, thematicSpaceVideojuegos, values_collectible5);
    const collectible5_db = await this.collectibleRepository.create(collectible5);
    createdCollectibles.push(collectible5_db);
    
    let values_collectible6: {[tag:string]: any} = {
      "Titulo": "Blasphemous Edicion Coleccionista",
      "Descripcion": "Blasphemous es un videojuego de acción de estilo metroidvania cuyo imaginario " +
                     "y cuidado diseño se inspiran en el folklore español y, más concretamente, en la " +
                     "Semana Santa andaluza",
      "Distribuidora": "Selecta Play"
    };
    let collectible6 = new Collectible(user2_db, thematicSpaceVideojuegos, values_collectible6);
    const collectible6_db = await this.collectibleRepository.create(collectible6);
    createdCollectibles.push(collectible6_db);

    let values_collectible7: {[tag:string]: any} = {
      "Titulo": "Final Fantasy VII Remake",
      "Descripcion": "Nueva adaptación de la obra maestra del rol japonés. El remake del séptimo " +
                     "capítulo de la saga nos trasladará al mundo de la entrega original de PlayStation y PC",
      "Distribuidora": "Koch Media"
    };
    let collectible7 = new Collectible(user2_db, thematicSpaceVideojuegos, values_collectible7);
    const collectible7_db = await this.collectibleRepository.create(collectible7);
    createdCollectibles.push(collectible7_db);

    let values_collectible8: {[tag:string]: any} = {
      "Titulo": "Fallout 4",
      "Descripcion": "Fallout 4 está ambientado en la post-apocalíptica zona estadounidense de la Commonwealth, " +
                     "Massachusetts en el año 2287, 210 años después del inicio de la guerra nuclear que " + 
                     "aniquilaria a gran parte de la civilización, en la que el o la protagonista sobrevive " +
                     "en un búnker subterráneo de la compañía Vault-Tec.",
      "Distribuidora": "Bethesda Softworks"
    };

    let collectible8 = new Collectible(user2_db, thematicSpaceVideojuegos, values_collectible8);
    const collectible8_db = await this.collectibleRepository.create(collectible8);
    createdCollectibles.push(collectible8_db);

    
    // --------- Espacio temático: Música, Usuario: jesus ---------

    let values_collectible9: {[tag:string]: any} = {
      "Album": "La flaca",
      "Grupo": "Jarabe de Palo",
      "Discografica": "Virgin Records"
    };
    let collectible9 = new Collectible(user3_db, thematicSpaceMusica, values_collectible9);
    const collectible9_db = await this.collectibleRepository.create(collectible9);
    createdCollectibles.push(collectible9_db);

    let values_collectible10: {[tag:string]: any} = {
      "Album": "Thriller",
      "Grupo": "Michael Jackson",
      "Discografica": "Epic Records"
    };
    let collectible10 = new Collectible(user3_db, thematicSpaceMusica, values_collectible10);
    const collectible10_db = await this.collectibleRepository.create(collectible10);
    createdCollectibles.push(collectible10_db);


    let values_collectible11: {[tag:string]: any} = {
      "Album": "The Fat of the Land",
      "Grupo": "The Prodigy",
      "Discografica": "Ragged Flag"
    };
    let collectible11 = new Collectible(user3_db, thematicSpaceMusica, values_collectible11);
    const collectible11_db = await this.collectibleRepository.create(collectible11);
    createdCollectibles.push(collectible11_db);

    let values_collectible12: {[tag:string]: any} = {
      "Album": "Cold Fact",
      "Grupo": "Sixto Rodriguez",
      "Discografica": "Sussex Records"
    };
    let collectible12 = new Collectible(user3_db, thematicSpaceMusica, values_collectible12);
    const collectible12_db = await this.collectibleRepository.create(collectible12);
    createdCollectibles.push(collectible12_db);

    let values_collectible13: {[tag:string]: any} = {
      "Album": "Coming From Reality",
      "Grupo": "Sixto Rodriguez",
      "Discografica": "Sussex Records"
    };
    let collectible13 = new Collectible(user3_db, thematicSpaceMusica, values_collectible13);
    const collectible13_db = await this.collectibleRepository.create(collectible13);
    createdCollectibles.push(collectible13_db);

    
    /*****************************************************************************
     *                             Colecciones                                   *
     *****************************************************************************/
    // Coleccion: Cervezas Españolas; Espacio: Cervezas del mundo; Propietario: utrilla (user1_db)
    let collection1CreateDto = new CreateCollectionDto();
    collection1CreateDto.name = "Cervezas Españolas";
    collection1CreateDto.userId = user1_db._id.toString();
    user1_db = await this.userService.createCollection(collection1CreateDto);
    
    let collection1_db = user1_db.collections.find(collection => collection.name === collection1CreateDto.name);
    collection1_db.collectibles.push(collectible1_db, collectible2_db, collectible3_db, collectible4_db);
    
    let collection1UpdateDto = new UpdateUsersDto();
    collection1UpdateDto.collections = user1_db.collections;
    this.userService.update(user1_db._id.toString(), collection1UpdateDto);


    // Coleccion: PS4 Collection; Espacio: Videojuegos; Propietario: pedrolo (user2_db)
    let collection2CreateDto = new CreateCollectionDto();
    collection2CreateDto.name = "PS4 Collection";
    collection2CreateDto.userId = user2_db._id.toString();
    user2_db = await this.userService.createCollection(collection2CreateDto);
    
    let collection2_db = user2_db.collections.find(collection => collection.name === collection2CreateDto.name);
    collection2_db.collectibles.push(collectible5_db, collectible6_db);
    
    let collection2UpdateDto = new UpdateUsersDto();
    collection2UpdateDto.collections = user2_db.collections;
    this.userService.update(user2_db._id.toString(), collection2UpdateDto);


    // Coleccion: PS5 Collection; Espacio: Videojuegos; Propietario: pedrolo (user2_db)
    let collection3CreateDto = new CreateCollectionDto();
    collection3CreateDto.name = "PS5 Collection";
    collection3CreateDto.userId = user2_db._id.toString();
    user2_db = await this.userService.createCollection(collection3CreateDto);
    
    let collection3_db = user2_db.collections.find(collection => collection.name === collection3CreateDto.name);
    collection3_db.collectibles.push(collectible7_db, collectible8_db);
    
    let collection3UpdateDto = new UpdateUsersDto();
    collection3UpdateDto.collections = user2_db.collections;
    this.userService.update(user2_db._id.toString(), collection3UpdateDto);


    // Coleccion: Vinilos; Espacio: Mi musicon; Propietario: jesus (user3_db)
    let collection4CreateDto = new CreateCollectionDto();
    collection4CreateDto.name = "Mis vinilos";
    collection4CreateDto.userId = user3_db._id.toString();
    user3_db = await this.userService.createCollection(collection4CreateDto);
    
    let collection4_db = user3_db.collections.find(collection => collection.name === collection4CreateDto.name);
    collection4_db.collectibles.push(collectible9_db, collectible10_db, collectible11_db, collectible12_db, collectible13_db);
    
    let collection4UpdateDto = new UpdateUsersDto();
    collection4UpdateDto.collections = user3_db.collections;
    this.userService.update(user3_db._id.toString(), collection4UpdateDto);


    return createdCollectibles;
  }
}
