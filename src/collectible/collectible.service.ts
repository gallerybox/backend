import { Injectable } from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { ThematicSpace } from '../thematic-spaces/models/ThematicSpace';
import { ThematicSpacesService } from '../thematic-spaces/thematic-spaces.service';
import { CreateCollectionDto } from '../users/dto/create-collection.dto';
import { UpdateUsersDto } from '../users/dto/update-users.dto';
import { Users } from '../users/schema/users.schema';
import { UsersService } from '../users/users.service'
import { Collectible } from './models/Collectible';
import { CollectibleRepository } from './repositories/collectible.repository';


@Injectable()
export class CollectibleService {

  constructor(
    private readonly userService: UsersService,
    private readonly thematicSpaceService: ThematicSpacesService,
    private readonly filesService: FilesService,
    private readonly collectibleRepository: CollectibleRepository
  ) {}

  async create(body: any, files: Express.Multer.File[]) {
    let user: Users, thematicSpace: ThematicSpace, s3UploadedFiles;
    let userId: string, thematicSpaceId: string, collectibleId: string;
    let values: {[tag:string]: any} = {};
    console.log(Object.keys(body).length);
    Object.keys(body).forEach(async function (key) {
      if (key === "userId") {
        console.log("user iddsdssdfs");
        console.log(key);
        userId = body[key];
      }else if (key === "thematicSpaceId")
        thematicSpaceId = body[key];
      else if (key === "collectibleId")
        collectibleId = body[key];
      else{
        if (body[key]==="#123true#" || body[key]==="#123false#"){
          values[key] = body[key]==="#123true#"?true:false;
        }else{
          values[key] = body[key];
        }
      }
    });

    // Si hay ficheros, los sube a AWS S3 y guarda las URL en values(attributes)

    if (files){
      s3UploadedFiles = await this.filesService.uploadFiles(files);
      s3UploadedFiles.forEach(s3File => {
        values[s3File.Fieldname] = decodeURI(s3File.Location)
      });
    }


    console.log(values);

    user = await this.userService.findOneById(userId);
    console.log("User: " + user._id);

    if (collectibleId){
      let collectible: Collectible = await this.collectibleRepository.findOne({_id: collectibleId});

      Object.keys(collectible.attributes).forEach(tag => {
        console.log(tag);
        collectible.attributes[tag].value = values[tag];
      });
      return await this.collectibleRepository.add(collectible);
    }else{
      thematicSpace = await this.thematicSpaceService.findOneById( thematicSpaceId );

      let collectible: Collectible = new Collectible(user, thematicSpace, values);
      collectible = await this.collectibleRepository.add(collectible);
      collectible.name = "Test JUANCA";
      user.collections = user.collections.map(collection => {
        if (collection.thematicSpace._id.toString() === thematicSpaceId){
          collection.collectibles.push(collectible);
        }
        return collection;
      })
      this.userService.upsert(user);
      return collectible;
    }

  }

  async findOne(id: string) {
    return await this.collectibleRepository.getOnePopulate(id);
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

  async update(collectible: Collectible) {
      return await this.collectibleRepository.add(collectible);
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
      "Nombre": "Cruzcampo Gran Reserva",
      "Graduacion": "7",
      "Tipo": "Rubia",
      "Foto": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/364c1283-d635-40e5-ad0f-2ad394e8b6f2-cruzcampo-gran-reserva-gnu1.2.jpeg",
      "Favorita": true
    };
    let collectible1 = new Collectible(user1_db, thematicSpaceCervezas, values_collectible1);
    const collectible1_db = await this.collectibleRepository.create(collectible1);
    createdCollectibles.push(collectible1_db);

    
    let values_collectible2: {[tag:string]: any} = {
      "Nombre": "Alhambra Reserva 1925",
      "Graduacion": "6.4",
      "Tipo": "Pilsen",
      "Foto": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/0f3fb711-69a2-4114-9c57-811ca380024f-alhambra-reserva-1925-cc.jpg",
      "Favorita": true
    };
    let collectible2 = new Collectible(user1_db, thematicSpaceCervezas, values_collectible2);
    const collectible2_db = await this.collectibleRepository.create(collectible2);
    createdCollectibles.push(collectible2_db);

    let values_collectible3: {[tag:string]: any} = {
      "Nombre": "Mahou",
      "Graduacion": "7.3",
      "Tipo": "Lager",
      "Foto": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/9bda6e6d-093c-41f5-a808-184d0f9f5e03-mahou-cc.jpg",
      "Favorita": false
    };
    let collectible3 = new Collectible(user1_db, thematicSpaceCervezas, values_collectible3);
    const collectible3_db = await this.collectibleRepository.create(collectible3);
    createdCollectibles.push(collectible3_db);

    let values_collectible4: {[tag:string]: any} = {
      "Nombre": "Alhambra Singular",
      "Graduacion": "5.4",
      "Tipo": "Lager",
      "Foto": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/ee3edb9e-33cb-419c-b105-86e20819bd20-estrella-galicia-cc.jpg",
      "Favorita": true
    };
    let collectible4 = new Collectible(user1_db, thematicSpaceCervezas, values_collectible4);
    const collectible4_db = await this.collectibleRepository.create(collectible4);
    createdCollectibles.push(collectible4_db);


    // --------- Espacio temático: Videojuegos, Usuario: pedrolo ---------

    let values_collectible5: {[tag:string]: any} = {
      "Titulo": "Gravity Rush Remastered",
      "Descripcion": "Una versión mejorada del juego, Gravity Rush Remastered, fue lanzada en Japón " + 
                     "a finales de 2015 y en Europa y Norteamérica a inicios de 2016 para PlayStation 4.",
      "Distribuidora": "Sony Interactive Entertainment",
      "Caratula": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/e147061e-ae3a-4b89-9665-24d794d80c0b-ps4-cover-cc.jpg",
      "Precintado": true
    };
    let collectible5 = new Collectible(user2_db, thematicSpaceVideojuegos, values_collectible5);
    const collectible5_db = await this.collectibleRepository.create(collectible5);
    createdCollectibles.push(collectible5_db);
    
    let values_collectible6: {[tag:string]: any} = {
      "Titulo": "Blasphemous Edicion Coleccionista",
      "Descripcion": "Blasphemous es un videojuego de acción de estilo metroidvania cuyo imaginario " +
                     "y cuidado diseño se inspiran en el folklore español y, más concretamente, en la " +
                     "Semana Santa andaluza",
      "Distribuidora": "Selecta Play",
      "Caratula": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/43702e26-d7ef-4570-b9fd-e099b19bc682-ps4-cover-cc.jpg",
      "Precintado": true
    };
    let collectible6 = new Collectible(user2_db, thematicSpaceVideojuegos, values_collectible6);
    const collectible6_db = await this.collectibleRepository.create(collectible6);
    createdCollectibles.push(collectible6_db);

    let values_collectible7: {[tag:string]: any} = {
      "Titulo": "Final Fantasy VII Remake",
      "Descripcion": "Nueva adaptación de la obra maestra del rol japonés. El remake del séptimo " +
                     "capítulo de la saga nos trasladará al mundo de la entrega original de PlayStation y PC",
      "Distribuidora": "Koch Media",
      "Caratula": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/6037854f-bb09-4dd6-a612-a2d601236cf7-ps5-cc4.0.jpg",
      "Precintado": false
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
      "Distribuidora": "Bethesda Softworks",
      "Caratula": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/658e0df8-d0c4-482f-8d70-c5b301fab33b-ps5-cc4.0.jpg",
      "Precintado": false
    };

    let collectible8 = new Collectible(user2_db, thematicSpaceVideojuegos, values_collectible8);
    const collectible8_db = await this.collectibleRepository.create(collectible8);
    createdCollectibles.push(collectible8_db);

    
    // --------- Espacio temático: Música, Usuario: jesus ---------

    let values_collectible9: {[tag:string]: any} = {
      "Album": "La flaca",
      "Grupo": "Jarabe de Palo",
      "Discografica": "Virgin Records",
      "Muestra": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/cf15df74-9583-4005-a325-ece0b9b677cb-dance-and-hiphop-sample-cc.mp3",
      "Videoclip": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/4729d65a-9093-4008-90e4-a0e3573d3bec-BuildingOnThePast-640x480-cc.mp4",
      "Activo": false
    };
    let collectible9 = new Collectible(user3_db, thematicSpaceMusica, values_collectible9);
    const collectible9_db = await this.collectibleRepository.create(collectible9);
    createdCollectibles.push(collectible9_db);

    let values_collectible10: {[tag:string]: any} = {
      "Album": "Thriller",
      "Grupo": "Michael Jackson",
      "Discografica": "Epic Records",
      "Muestra": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/217db708-7464-4a3f-93ba-2308b41087e9-dance-and-hiphop-sample-cc.mp3",
      "Videoclip": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/b8742f69-4a18-454b-9083-bb8a0da5b1ff-BuildingOnThePast-640x480-cc.mp4",
      "Activo": false
    };
    let collectible10 = new Collectible(user3_db, thematicSpaceMusica, values_collectible10);
    const collectible10_db = await this.collectibleRepository.create(collectible10);
    createdCollectibles.push(collectible10_db);


    let values_collectible11: {[tag:string]: any} = {
      "Album": "The Fat of the Land",
      "Grupo": "The Prodigy",
      "Discografica": "Ragged Flag",
      "Muestra": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/186c9ed3-156d-496e-9817-9fcbf35c0f37-dance-and-hiphop-sample-cc.mp3",
      "Videoclip": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/6a9a8a81-5b17-449e-abd4-e4d1e611ad92-BuildingOnThePast-640x480-cc.mp4",
      "Activo": false
    };
    let collectible11 = new Collectible(user3_db, thematicSpaceMusica, values_collectible11);
    const collectible11_db = await this.collectibleRepository.create(collectible11);
    createdCollectibles.push(collectible11_db);

    let values_collectible12: {[tag:string]: any} = {
      "Album": "Cold Fact",
      "Grupo": "Sixto Rodriguez",
      "Discografica": "Sussex Records",
      "Muestra": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/413e02cc-4a70-47df-a8b0-4ca137d9a3a0-dance-and-hiphop-sample-cc.mp3",
      "Videoclip": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/5e0f7814-1c39-48f6-b0ca-cf205aa9dc32-BuildingOnThePast-640x480-cc.mp4",
      "Activo": true
    };
    let collectible12 = new Collectible(user3_db, thematicSpaceMusica, values_collectible12);
    const collectible12_db = await this.collectibleRepository.create(collectible12);
    createdCollectibles.push(collectible12_db);

    let values_collectible13: {[tag:string]: any} = {
      "Album": "Coming From Reality",
      "Grupo": "Sixto Rodriguez",
      "Discografica": "Sussex Records",
      "Muestra": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/066fb5fe-6155-4870-b90e-460b6bc2335c-dance-and-hiphop-sample-cc.mp3",
      "Videoclip": "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/c3831efa-5c0c-4d0f-be89-39e5a4eacf33-BuildingOnThePast-640x480-cc.mp4",
      "Activo": true
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
    collection1CreateDto.thematicSpace = thematicSpaceCervezas;
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
    collection2CreateDto.thematicSpace = thematicSpaceVideojuegos;
    collection2CreateDto.userId = user2_db._id.toString();
    user2_db = await this.userService.createCollection(collection2CreateDto);
    
    let collection2_db = user2_db.collections.find(collection => collection.name === collection2CreateDto.name);
    collection2_db.collectibles.push(collectible5_db, collectible6_db, collectible7_db, collectible8_db);
    
    let collection2UpdateDto = new UpdateUsersDto();
    collection2UpdateDto.collections = user2_db.collections;
    this.userService.update(user2_db._id.toString(), collection2UpdateDto);


    // Coleccion: Vinilos; Espacio: Mi musicon; Propietario: jesus (user3_db)
    let collection4CreateDto = new CreateCollectionDto();
    collection4CreateDto.name = "Mis vinilos";
    collection4CreateDto.thematicSpace = thematicSpaceMusica;
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