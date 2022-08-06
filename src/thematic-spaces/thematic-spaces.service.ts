import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUsersDto } from 'src/users/dto/create-users.dto';
import { UpdateUsersDto } from 'src/users/dto/update-users.dto';
import { UsersService } from 'src/users/users.service';
import { Attribute } from './models/Attribute';
import { Template } from './models/Template';
import { ThematicSpace, ThematicSpaceDocument } from './models/ThematicSpace';
import { Category, TextRepresentation, Type } from './models/Type';
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

  async findOneByName(name: string) {
    return await this.thematicSpaceRepository.findOne({ name: name });
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
    // return await this.thematicSpaceRepository.find({});
  }

  async populate(){
    /*****************************************************************************
    *                             Usuario 1 - utrilla                            *
    *****************************************************************************/
    let user1: CreateUsersDto = new CreateUsersDto();
    user1.email = "utri1990@gmail.com";
    user1.nickname = "utrilla";
    user1.password = "$2b$10$0fqfaIvTTMk/jDJ.gzqHdOAiOdb/hMygWHrOY4o/cq/OEH8d8Z8ma" // 1234
    let user1_db = await this.userService.create(user1);

    /*****************************************************************************
    *                             Usuario 2 - pedrolo                            *
    *****************************************************************************/
    let user2: CreateUsersDto = new CreateUsersDto();
    user2.email = "pedrolo@gmail.com";
    user2.nickname = "pedrolo";
    user2.password = "$2b$10$lOeSeU5WCe2YN3zueIUyTOfe67RRRhZ.yaSfNM3Qm681VqWn4eyQe" // 1234
    let user2_db = await this.userService.create(user2);

    /*****************************************************************************
    *                             Usuario 3 - jesus                              *
    *****************************************************************************/
     let user3: CreateUsersDto = new CreateUsersDto();
     user3.email = "jesus@gmail.com";
     user3.nickname = "jesus";
     user3.password = "$$2b$10$JVCpFhmL43NmFcUZYMx7turOSCJ7vnec1OSRuYCh4aeJVM8Kk1bn2" // 1234
     let user3_db = await this.userService.create(user3);

    /*****************************************************************************
    *                    Espacio temático 1 - Cervezas del mundo                 *
    *****************************************************************************/
    // ------------------------ Atributo - Nombre (Texto) -------------------------
    
    // Representación gráfica
    let nombreCervezaRepr: TextRepresentation = new TextRepresentation();
    nombreCervezaRepr.bold = true;
    nombreCervezaRepr.font = "CustomFont1";
    nombreCervezaRepr.color = "#111111";
    nombreCervezaRepr.italics =  true;
    nombreCervezaRepr.maxLength = 13;
    nombreCervezaRepr.size = 15;

    // Tipo = Categoria (Texto) + Representación gráfica
    let nombreCervezaType: Type = new Type();            
    nombreCervezaType.representation = nombreCervezaRepr; 
    nombreCervezaType.category = Category.Text;

    let nombreCervezaAttribute: Attribute = new Attribute();
    nombreCervezaAttribute.type = nombreCervezaType;                 // Tipo
    nombreCervezaAttribute.tag = "Nombre";                           // Texto del atributo
    nombreCervezaAttribute.showTag = true;                           // ¿Muestra el dato?
    nombreCervezaAttribute.representationOrder = 0;                  // Ubicación del elemento en pantalla
    
    // ---------------------- Atributo - Graduacion (Texto) -----------------------
    
    // Representación gráfica
    let graduacionCervezaRepr: TextRepresentation = new TextRepresentation();
    graduacionCervezaRepr.bold = true;
    graduacionCervezaRepr.font = "CustomFont2";
    graduacionCervezaRepr.color = "#403E28";
    graduacionCervezaRepr.italics =  true;
    graduacionCervezaRepr.maxLength = 20;
    graduacionCervezaRepr.size = 15;

    // Tipo = Categoria (Texto) + Representación gráfica
    let graduacionType : Type = new Type();            
    graduacionType.representation = graduacionCervezaRepr; 
    graduacionType.category = Category.Text;

    let graduacionCervezaAttribute: Attribute = new Attribute();
    graduacionCervezaAttribute.type = graduacionType;                 // Tipo
    graduacionCervezaAttribute.tag = "Graduacion";                    // Texto del atributo
    graduacionCervezaAttribute.showTag = true;                        // ¿Muestra el dato?
    graduacionCervezaAttribute.representationOrder = 1;               // Ubicación del elemento en pantalla

    // ------------------------ Atributo - Tipo (Texto) --------------------------

    // Representación gráfica
    let tipoCervezaRepr: TextRepresentation = new TextRepresentation();
    tipoCervezaRepr.bold = true;
    tipoCervezaRepr.font = "CustomFont3";
    tipoCervezaRepr.color = "#AAAAAA";
    tipoCervezaRepr.italics =  false;
    tipoCervezaRepr.maxLength = 35;
    tipoCervezaRepr.size = 15;

    // Tipo = Categoria (Texto) + Representación gráfica
    let tipoCervezaType : Type = new Type();            
    tipoCervezaType.representation = tipoCervezaRepr; 
    tipoCervezaType.category = Category.Text;

    let tipoCervezaAttribute: Attribute = new Attribute();
    tipoCervezaAttribute.type = tipoCervezaType;                      // Tipo
    tipoCervezaAttribute.tag = "Tipo";                                // Texto del atributo
    tipoCervezaAttribute.showTag = true;                              // ¿Muestra el dato?
    tipoCervezaAttribute.representationOrder = 2;                     // Ubicación del elemento en pantalla

    // Plantilla: guarda cada uno de los atributos
    let templateCervezas: Template = new Template();
    templateCervezas.attributes = [
      nombreCervezaAttribute,
      graduacionCervezaAttribute,
      tipoCervezaAttribute
    ];    

    // Espacio temático: name + template + description
    let thematicSpaceCervezas: ThematicSpace = await this.thematicSpaceRepository.add({
      template: templateCervezas,
      name: "Cervezas del mundo",
      description: "Colección de todas las cervezas del mundo"
    });

    /*****************************************************************************
    *                    Espacio temático 2 - Videojuego                         *
    *****************************************************************************/
    // ------------------------ Atributo - Titulo (Texto) -------------------------
    
    // Representación gráfica
    let tituloVideojuegoRepr: TextRepresentation = new TextRepresentation();
    tituloVideojuegoRepr.bold = true;
    tituloVideojuegoRepr.font = "CustomFont4";
    tituloVideojuegoRepr.color = "#111111";
    tituloVideojuegoRepr.italics =  true;
    tituloVideojuegoRepr.maxLength = 13;
    tituloVideojuegoRepr.size = 15;

    // Tipo = Categoria (Texto) + Representación gráfica
    let tituloVideojuegoType: Type = new Type();            
    tituloVideojuegoType.representation = tituloVideojuegoRepr; 
    tituloVideojuegoType.category = Category.Text;

    let tituloVideojuegoAttribute: Attribute = new Attribute();
    tituloVideojuegoAttribute.type = tituloVideojuegoType;            // Tipo
    tituloVideojuegoAttribute.tag = "Titulo";                         // Texto del atributo
    tituloVideojuegoAttribute.showTag = true;                         // ¿Muestra el dato?
    tituloVideojuegoAttribute.representationOrder = 0;                // Ubicación del elemento en pantalla
    
    // ---------------------- Atributo - Descripcion (Text) ----------------------
    
    // Representación gráfica
    let descriptionVideojuegoRepr: TextRepresentation = new TextRepresentation();
    descriptionVideojuegoRepr.bold = true;
    descriptionVideojuegoRepr.font = "CustomFont5";
    descriptionVideojuegoRepr.color = "#403E28";
    descriptionVideojuegoRepr.italics =  true;
    descriptionVideojuegoRepr.maxLength = 20;
    descriptionVideojuegoRepr.size = 15;

    // Tipo = Categoria (Texto) + Representación gráfica
    let descriptionVideojuegoType : Type = new Type();            
    descriptionVideojuegoType.representation = descriptionVideojuegoRepr; 
    descriptionVideojuegoType.category = Category.Text;

    let descripcionVideojuegoAttribute: Attribute = new Attribute();
    descripcionVideojuegoAttribute.type = descriptionVideojuegoType;  // Tipo
    descripcionVideojuegoAttribute.tag = "Descripcion";               // Texto del atributo
    descripcionVideojuegoAttribute.showTag = true;                    // ¿Muestra el dato?
    descripcionVideojuegoAttribute.representationOrder = 1;           // Ubicación del elemento en pantalla

    // ------------------------- Atributo - Distribuidora (Text) -------------------------

    // Representación gráfica
    let distribuidoraVideojuegoRepr: TextRepresentation = new TextRepresentation();
    distribuidoraVideojuegoRepr.bold = true;
    distribuidoraVideojuegoRepr.font = "CustomFont6";
    distribuidoraVideojuegoRepr.color = "#AAAAAA";
    distribuidoraVideojuegoRepr.italics =  false;
    distribuidoraVideojuegoRepr.maxLength = 35;
    distribuidoraVideojuegoRepr.size = 15;

    // Tipo = Categoria (Texto) + Representación gráfica
    let distribuidoraVideojuegoType : Type = new Type();            
    distribuidoraVideojuegoType.representation = distribuidoraVideojuegoRepr; 
    distribuidoraVideojuegoType.category = Category.Text;

    let distribuidoraVideojuegoAttribute: Attribute = new Attribute();
    distribuidoraVideojuegoAttribute.type = distribuidoraVideojuegoType;  // Tipo
    distribuidoraVideojuegoAttribute.tag = "Distribuidora";               // Texto del atributo
    distribuidoraVideojuegoAttribute.showTag = true;                      // ¿Muestra el dato?
    distribuidoraVideojuegoAttribute.representationOrder = 2;             // Ubicación del elemento en pantalla

    // Plantilla: guarda cada uno de los atributos
    let templateVideojuegos: Template = new Template();
    
    templateVideojuegos.attributes = [
      tituloVideojuegoAttribute, 
      descripcionVideojuegoAttribute,
      distribuidoraVideojuegoAttribute
    ];    

    // Espacio temático: name + template + description
    let thematicSpaceVideojuegos: ThematicSpace = await this.thematicSpaceRepository.add({
      template: templateVideojuegos,
      name: "Videojuegos",
      description: "Colección de los videojuegos de toda la vida"
    });


    /*****************************************************************************
    *                      Espacio temático 3 - Musica                           *
    *****************************************************************************/
    // ------------------------ Atributo - Album (Texto) -------------------------
    
    // Representación gráfica
    let albumMusicaRepr: TextRepresentation = new TextRepresentation();
    albumMusicaRepr.bold = true;
    albumMusicaRepr.font = "CustomFont7";
    albumMusicaRepr.color = "#111111";
    albumMusicaRepr.italics =  true;
    albumMusicaRepr.maxLength = 13;
    albumMusicaRepr.size = 15;

    // Tipo = Categoria (Texto) + Representación gráfica
    let albumMusicaType: Type = new Type();            
    albumMusicaType.representation = albumMusicaRepr; 
    albumMusicaType.category = Category.Text;

    let albumMusicaAttribute: Attribute = new Attribute();
    albumMusicaAttribute.type = albumMusicaType;                      // Tipo
    albumMusicaAttribute.tag = "Album";                               // Texto del atributo
    albumMusicaAttribute.showTag = true;                              // ¿Muestra el dato?
    albumMusicaAttribute.representationOrder = 0;                     // Ubicación del elemento en pantalla
    
    // ---------------------- Atributo - Grupo (Text) ----------------------
    
    // Representación gráfica
    let grupoMusicaRepr: TextRepresentation = new TextRepresentation();
    grupoMusicaRepr.bold = true;
    grupoMusicaRepr.font = "CustomFont8";
    grupoMusicaRepr.color = "#403E28";
    grupoMusicaRepr.italics =  true;
    grupoMusicaRepr.maxLength = 20;
    grupoMusicaRepr.size = 15;

    // Tipo = Categoria (Texto) + Representación gráfica
    let grupoMusicaType: Type = new Type();            
    grupoMusicaType.representation = grupoMusicaRepr; 
    grupoMusicaType.category = Category.Text;

    let grupoMusicaAttribute: Attribute = new Attribute();
    grupoMusicaAttribute.type = grupoMusicaType;                      // Tipo
    grupoMusicaAttribute.tag = "Grupo";                               // Texto del atributo
    grupoMusicaAttribute.showTag = true;                              // ¿Muestra el dato?
    grupoMusicaAttribute.representationOrder = 1;                     // Ubicación del elemento en pantalla

    // ------------------------- Atributo - Discografica(Text) -------------------------

    // Representación gráfica
    let discograficaMusicaRepr: TextRepresentation = new TextRepresentation();
    discograficaMusicaRepr.bold = true;
    discograficaMusicaRepr.font = "CustomFont9";
    discograficaMusicaRepr.color = "#AAAAAA";
    discograficaMusicaRepr.italics =  false;
    discograficaMusicaRepr.maxLength = 35;
    discograficaMusicaRepr.size = 15;

    // Tipo = Categoria (Texto) + Representación gráfica
    let discograficaMusicaType : Type = new Type();            
    discograficaMusicaType.representation = discograficaMusicaRepr; 
    discograficaMusicaType.category = Category.Text;

    let discograficaMusicaAttribute: Attribute = new Attribute();
    discograficaMusicaAttribute.type = discograficaMusicaType;         // Tipo
    discograficaMusicaAttribute.tag = "Discografica";            // Texto del atributo
    discograficaMusicaAttribute.showTag = true;                        // ¿Muestra el dato?
    discograficaMusicaAttribute.representationOrder = 2;               // Ubicación del elemento en pantalla

    // Plantilla: guarda cada uno de los atributoss
    let templateMusica: Template = new Template();
    templateMusica.attributes = [
      albumMusicaAttribute,
      grupoMusicaAttribute,
      discograficaMusicaAttribute
    ];    

    // Espacio temático: name + template + description
    let thematicSpaceMusica: ThematicSpace = await this.thematicSpaceRepository.add({
      template: templateMusica,
      name: "Mi musicon",
      description: "Colección de toda la musica que he coleccionado durante estos años"
    });
  
    /*****************************************************************************
    *                          Actualizando users                                *
    *****************************************************************************/
    let user1_updated = new UpdateUsersDto();
    user1_updated.email = user1_db.email;
    user1_updated.nickname = user1_db.nickname;
    user1_updated.password = user1_db.password;
    user1_updated.followedUsers = [user2_db._id.toString()];
    user1_updated.ownedThematicSpaces = [ thematicSpaceCervezas._id.toString() ];
    user1_updated.followedThematicSpaces = [ thematicSpaceVideojuegos._id.toString() ];
    user1_updated.followedUsers = [ user3_db._id.toString() ];

    user1_db = await this.userService.update(user1_db._id.toString(), user1_updated);

    let user2_updated = new UpdateUsersDto();
    user2_updated.email = user2_db.email;
    user2_updated.nickname = user2_db.nickname;
    user2_updated.password = user2_db.password;
    user2_updated.followedUsers = [];
    user2_updated.ownedThematicSpaces = [ thematicSpaceVideojuegos._id.toString() ];
    user2_updated.followedThematicSpaces = [];
    user2_updated.followedUsers = [ ];

    user2_db = await this.userService.update(user2_db._id.toString(), user2_updated);

    let user3_updated = new UpdateUsersDto();
    
    user3_updated.email = user3_db.email;
    user3_updated.nickname = user3_db.nickname;
    user3_updated.password = user3_db.password;
    user3_updated.followedUsers = [];
    user3_updated.ownedThematicSpaces = [thematicSpaceMusica._id.toString()];
    user3_updated.followedThematicSpaces = [];
    user3_updated.followedUsers = [];

    user3_db = await this.userService.update(user3_db._id.toString(), user3_updated);

    return [thematicSpaceCervezas, thematicSpaceVideojuegos, thematicSpaceMusica];
  }
}
