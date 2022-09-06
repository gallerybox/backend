import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { CreateUsersDto } from '../users/dto/create-users.dto';
import { UpdateUsersDto } from '../users/dto/update-users.dto';
import { Users } from '../users/schema/users.schema';
import { UsersService } from '../users/users.service';
import { Attribute } from './models/Attribute';
import { Template } from './models/Template';
import { ThematicSpace, ThematicSpaceDocument } from './models/ThematicSpace';
import { Category, MultimediaRepresentation, MultimediaType, TextRepresentation, Type, ToggleRepresentation, ToggleType } from './models/Type';
import { ThematicSpaceRepository } from './repositories/thematic-spaces.repository';

@Injectable()
export class ThematicSpacesService {
  constructor(
    private readonly thematicSpaceRepository: ThematicSpaceRepository,
    private readonly userService: UsersService,
    //@InjectModel(ThematicSpace.name) private thematicSpaceModel: Model<ThematicSpaceDocument>,
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

  async followSpaceByUserId(userId: string, thematicSpaceId: string) {
    let user: Document<unknown, any, Users> & Users & Required<{ _id: Types.ObjectId; }>

    // Comprobación: Espacio temático y Usuario existen
    try {
      user = await this.userService.findOneById(userId);
      await this.findOneById(thematicSpaceId);
    }
    catch (error){
      throw new BadRequestException("BAD_DATA")
    }

    if (user.followedThematicSpaces
        .map((tSpace: ThematicSpace) => tSpace._id.toString())
        .includes(thematicSpaceId))
      throw new BadRequestException("SPACE_ALREADY_ADDED");
    else if (user.ownedThematicSpaces
        .map((tSpace: ThematicSpace) => tSpace._id.toString())
        .includes(thematicSpaceId))
      throw new BadRequestException("SPACE_BELONGS_USER")
    else {
      let updateUserDTO = await this.userService.getUpdateDTO(userId);
      updateUserDTO.followedThematicSpaces.push(thematicSpaceId);
      return this.userService.update(userId, updateUserDTO);
    }
  }

  async create(thematicSpace: ThematicSpace) {
    return await this.thematicSpaceRepository.add(thematicSpace);
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
    return this.thematicSpaceRepository.removeByTag(tag);
    // return await this.thematicSpaceRepository.find({});
  }

  async populate(){
    enum Fonts {
        Font1 = "\"Roboto\"",
        Font2 = "\"Roboto Mono\"",
        Font3 = "\"Roboto Serif\"",
        Font4 = "\"Gloria Hallelujah\"",
        Font5 = "\"Press Start 2P\"",
        Font6 = "\"Rye\"",
    }
    
    enum FontSize {
        Pequenyo = 9,
        Mediano = 14,
        Grande = 20
    }

    enum IconSelected {
        Favorite = "Favorite",
        Bookmark = "Bookmark",
        Star = "Star"
    }
  
    /*****************************************************************************
    *                             Usuario 1 - utrilla                            *
    *****************************************************************************/
  
    let user1: CreateUsersDto = new CreateUsersDto();
    user1.email = "utri1990@gmail.com";
    user1.nickname = "utrilla";
    user1.nombre = "Juan Carlos";
    user1.apellidos = "Utrilla Martín"
    user1.password = "$2b$10$0fqfaIvTTMk/jDJ.gzqHdOAiOdb/hMygWHrOY4o/cq/OEH8d8Z8ma" // 1234
    user1.profilePhoto = "http://gallerybox-bucket.s3.eu-west-1.amazonaws.com/ea872f6d-fb36-4a4c-b3ec-215764c736cb-avatar-men.jpg"
    user1.hasConsented = true;
    let user1_db = await this.userService.create(user1);

    /*****************************************************************************
    *                             Usuario 2 - pedrolo                            *
    *****************************************************************************/
    let user2: CreateUsersDto = new CreateUsersDto();
    user2.email = "pedrolo@gmail.com";
    user2.nombre = "Pedro Gonzalo";
    user2.apellidos = "Bernaldez Torres"
    user2.nickname = "pedrolo";
    user2.password = "$2b$10$0fqfaIvTTMk/jDJ.gzqHdOAiOdb/hMygWHrOY4o/cq/OEH8d8Z8ma" // 1234
    user2.hasConsented = true;
    user2.profilePhoto = "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/08e6c6ee-40fc-4142-b8cf-25d87ecc5abf-avatar-men2.jpg";
    let user2_db = await this.userService.create(user2);

    /*****************************************************************************
    *                             Usuario 3 - jesus                              *
    *****************************************************************************/
     let user3: CreateUsersDto = new CreateUsersDto();
     user3.email = "jesus@gmail.com";
     user3.nickname = "jesus";
     user3.nombre = "Jesús";
     user3.apellidos = "Ortíz Calleja";
     user3.password = "$2b$10$0fqfaIvTTMk/jDJ.gzqHdOAiOdb/hMygWHrOY4o/cq/OEH8d8Z8ma" // 1234
     user3.hasConsented = true;
     user3.profilePhoto = "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/2ab093fb-908b-424b-8bf1-ac633a11872d-avatar-men3.jpg"
     let user3_db = await this.userService.create(user3);

    /*****************************************************************************
    *                    Espacio temático 1 - Cervezas del mundo                 *
    *****************************************************************************/
    // Atributos: Nombre (Text), Graduacion(Text), Tipo(Text), Foto(Multimedia.Photo)
    // ------------------------ Atributo - Nombre (Texto) -------------------------
    
    // Representación gráfica
    let nombreCervezaRepr: TextRepresentation = new TextRepresentation();
    nombreCervezaRepr.bold = true;
    nombreCervezaRepr.font = Fonts.Font1;
    nombreCervezaRepr.color = "#111111";
    nombreCervezaRepr.italics =  true;
    nombreCervezaRepr.underlined = false;
    nombreCervezaRepr.size = FontSize.Grande;

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
    graduacionCervezaRepr.font = Fonts.Font2;
    graduacionCervezaRepr.color = "#403E28";
    graduacionCervezaRepr.italics =  true;
    graduacionCervezaRepr.underlined = true;
    graduacionCervezaRepr.size = FontSize.Pequenyo;

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
    tipoCervezaRepr.font = Fonts.Font2;
    tipoCervezaRepr.color = "#AAAAAA";
    tipoCervezaRepr.italics =  false;
    tipoCervezaRepr.underlined = false;
    tipoCervezaRepr.size = FontSize.Mediano;

    // Tipo = Categoria (Texto) + Representación gráfica
    let tipoCervezaType : Type = new Type();            
    tipoCervezaType.representation = tipoCervezaRepr; 
    tipoCervezaType.category = Category.Text;

    let tipoCervezaAttribute: Attribute = new Attribute();
    tipoCervezaAttribute.type = tipoCervezaType;                      // Tipo
    tipoCervezaAttribute.tag = "Tipo";                                // Texto del atributo
    tipoCervezaAttribute.showTag = false;                             // ¿Muestra el dato?
    tipoCervezaAttribute.representationOrder = 2;                     // Ubicación del elemento en pantalla
    
    // --------------------- Atributo - Foto (Multimedia - Photo) ---------------------

    // Representación gráfica
    let imagenCervezaRepr: MultimediaRepresentation = new MultimediaRepresentation();
    imagenCervezaRepr.dimensions = [50, 100];
    imagenCervezaRepr.multimediaType = MultimediaType.Photo;

    // Tipo = Categoria (Texto) + Representación gráfica
    let imagenCervezaType: Type = new Type();
    imagenCervezaType.representation = imagenCervezaRepr;
    imagenCervezaType.category = Category.Multimedia;
    
    let imagenCervezaAttribute: Attribute = new Attribute();
    imagenCervezaAttribute.type = imagenCervezaType;
    imagenCervezaAttribute.tag = "Foto";
    imagenCervezaAttribute.showTag = true;
    imagenCervezaAttribute.representationOrder = 3;


    // --------------------- Atributo - Favorita (Toogle) ---------------------

    // Representación gráfica
    let esFavoritaCervezaRepr: ToggleRepresentation = new ToggleRepresentation();
    esFavoritaCervezaRepr.toggleType = ToggleType.Icon;
    esFavoritaCervezaRepr.icon = IconSelected.Favorite;
    esFavoritaCervezaRepr.colorTrue = "#0000FF";
    esFavoritaCervezaRepr.colorFalse = "#FF0000";

    // Tipo = Categoria (Texto) + Representación gráfica
    let esFavoritaCervezaType: Type = new Type();
    esFavoritaCervezaType.representation = esFavoritaCervezaRepr;
    esFavoritaCervezaType.category = Category.Toggle;
    
    let esFavoritaCervezaAttribute: Attribute = new Attribute();
    esFavoritaCervezaAttribute.type = esFavoritaCervezaType;
    esFavoritaCervezaAttribute.tag = "Favorita";
    esFavoritaCervezaAttribute.showTag = true;
    esFavoritaCervezaAttribute.representationOrder = 4;

    // --------------------------- Fin atributos ------------------------------
  
    // Plantilla: guarda cada uno de los atributos
    let templateCervezas: Template = new Template();
    templateCervezas.attributes = [
      nombreCervezaAttribute,
      esFavoritaCervezaAttribute,
      graduacionCervezaAttribute,
      tipoCervezaAttribute,
      imagenCervezaAttribute
    ];    

    // Espacio temático: name + template + description
    let thematicSpaceCervezas: ThematicSpace = await this.thematicSpaceRepository.add({
      template: templateCervezas,
      name: "Cervezas del mundo",
      description: "Colección de todas las cervezas del mundo"
    });
    
    
    /*****************************************************************************
    *                    Espacio temático 2 - Videojuegos                         *
    *****************************************************************************/
    // Atributos: Titulo (Text), Descripcion (Text), Distribuidora (Text), Caratula (Multimedia - Foto) 
    // ------------------------ Atributo - Titulo (Texto) -------------------------
    
    // Representación gráfica
    let tituloVideojuegoRepr: TextRepresentation = new TextRepresentation();
    tituloVideojuegoRepr.bold = true;
    tituloVideojuegoRepr.font = Fonts.Font3;
    tituloVideojuegoRepr.color = "#111111";
    tituloVideojuegoRepr.italics =  true;
    tituloVideojuegoRepr.underlined = false;
    tituloVideojuegoRepr.size = FontSize.Grande;

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
    descriptionVideojuegoRepr.font = Fonts.Font4;
    descriptionVideojuegoRepr.color = "#403E28";
    descriptionVideojuegoRepr.italics =  true;
    descriptionVideojuegoRepr.underlined = true;
    descriptionVideojuegoRepr.size = FontSize.Pequenyo;

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
    distribuidoraVideojuegoRepr.font = Fonts.Font5;
    distribuidoraVideojuegoRepr.color = "#AAAAAA";
    distribuidoraVideojuegoRepr.italics = false;
    distribuidoraVideojuegoRepr.underlined = true;
    distribuidoraVideojuegoRepr.size = FontSize.Mediano;

    // Tipo = Categoria (Texto) + Representación gráfica
    let distribuidoraVideojuegoType : Type = new Type();            
    distribuidoraVideojuegoType.representation = distribuidoraVideojuegoRepr; 
    distribuidoraVideojuegoType.category = Category.Text;

    let distribuidoraVideojuegoAttribute: Attribute = new Attribute();
    distribuidoraVideojuegoAttribute.type = distribuidoraVideojuegoType;  // Tipo
    distribuidoraVideojuegoAttribute.tag = "Distribuidora";               // Texto del atributo
    distribuidoraVideojuegoAttribute.showTag = false;                      // ¿Muestra el dato?
    distribuidoraVideojuegoAttribute.representationOrder = 2;             // Ubicación del elemento en pantalla

    // --------------------- Atributo - Caratula (Multimedia - Photo) ---------------------

    // Representación gráfica
    let caratulaVideojuegoRepr: MultimediaRepresentation = new MultimediaRepresentation();
    caratulaVideojuegoRepr.dimensions = [50, 100];
    caratulaVideojuegoRepr.multimediaType = MultimediaType.Photo ;

    // Tipo = Categoria (Texto) + Representación gráfica
    let caratulaVideojuegoType: Type = new Type();
    caratulaVideojuegoType.representation = caratulaVideojuegoRepr;
    caratulaVideojuegoType.category = Category.Multimedia;
    
    let caratulaVideojuegoAttribute: Attribute = new Attribute();
    caratulaVideojuegoAttribute.type = caratulaVideojuegoType;
    caratulaVideojuegoAttribute.tag = "Caratula";
    caratulaVideojuegoAttribute.showTag = true;
    caratulaVideojuegoAttribute.representationOrder = 3;

    // --------------------- Atributo - Precintado (Toogle) ---------------------

    // Representación gráfica
    let estaPrecintadoVideojuegoRepr: ToggleRepresentation = new ToggleRepresentation();
    estaPrecintadoVideojuegoRepr.toggleType = ToggleType.Icon;
    estaPrecintadoVideojuegoRepr.icon = IconSelected.Bookmark;
    estaPrecintadoVideojuegoRepr.colorTrue = "#00FF00";
    estaPrecintadoVideojuegoRepr.colorFalse = "#FF0000";

    // Tipo = Categoria (Texto) + Representación gráfica
    let estaPrecintadoVideojuegoType: Type = new Type();
    estaPrecintadoVideojuegoType.representation = estaPrecintadoVideojuegoRepr;
    estaPrecintadoVideojuegoType.category = Category.Toggle;
    
    let estaPrecintadoVideojuegoAttribute: Attribute = new Attribute();
    estaPrecintadoVideojuegoAttribute.type = estaPrecintadoVideojuegoType;
    estaPrecintadoVideojuegoAttribute.tag = "Precintado";
    estaPrecintadoVideojuegoAttribute.showTag = true;
    estaPrecintadoVideojuegoAttribute.representationOrder = 4;

    // --------------------------- Fin atributos ------------------------------

    // Plantilla: guarda cada uno de los atributos
    let templateVideojuegos: Template = new Template();
    
    templateVideojuegos.attributes = [
      tituloVideojuegoAttribute, 
      estaPrecintadoVideojuegoAttribute,
      descripcionVideojuegoAttribute,
      distribuidoraVideojuegoAttribute,
      caratulaVideojuegoAttribute
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
    // Atributos: Album (Text), Grupo (Text), Discografica (Text),
    //            Muestra (Multimedia.Audio), Videoclip (Multimedia.Video)
    // ------------------------ Atributo - Album (Texto) -------------------------
    
    // Representación gráfica
    let albumMusicaRepr: TextRepresentation = new TextRepresentation();
    albumMusicaRepr.bold = true;
    albumMusicaRepr.font = Fonts.Font6;
    albumMusicaRepr.color = "#111111";
    albumMusicaRepr.italics =  true;
    albumMusicaRepr.underlined = false;
    albumMusicaRepr.size = FontSize.Grande;

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
    grupoMusicaRepr.font = Fonts.Font6;
    grupoMusicaRepr.color = "#403E28";
    grupoMusicaRepr.italics =  true;
    grupoMusicaRepr.underlined = true;
    grupoMusicaRepr.size = FontSize.Mediano;

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
    discograficaMusicaRepr.font = Fonts.Font6;
    discograficaMusicaRepr.color = "#AAAAAA";
    discograficaMusicaRepr.italics =  false;
    discograficaMusicaRepr.underlined = true;
    discograficaMusicaRepr.size = FontSize.Pequenyo;

    // Tipo = Categoria (Texto) + Representación gráfica
    let discograficaMusicaType : Type = new Type();            
    discograficaMusicaType.representation = discograficaMusicaRepr; 
    discograficaMusicaType.category = Category.Text;

    let discograficaMusicaAttribute: Attribute = new Attribute();
    discograficaMusicaAttribute.type = discograficaMusicaType;         // Tipo
    discograficaMusicaAttribute.tag = "Discografica";                  // Texto del atributo
    discograficaMusicaAttribute.showTag = false;                        // ¿Muestra el dato?
    discograficaMusicaAttribute.representationOrder = 2;               // Ubicación del elemento en pantalla

    // --------------------- Atributo - Muestra (Multimedia - Audio) ---------------------

    // Representación gráfica
    let muestraMusicaRepr: MultimediaRepresentation = new MultimediaRepresentation();
    muestraMusicaRepr.dimensions = [75, 100];
    muestraMusicaRepr.multimediaType = MultimediaType.Audio;

    // Tipo = Categoria (Texto) + Representación gráfica
    let muestraMusicaType: Type = new Type();
    muestraMusicaType.representation = muestraMusicaRepr;
    muestraMusicaType.category = Category.Multimedia;
    
    let muestraMusicaAttribute: Attribute = new Attribute();
    muestraMusicaAttribute.type = muestraMusicaType;
    muestraMusicaAttribute.tag = "Muestra";
    muestraMusicaAttribute.showTag = true;
    muestraMusicaAttribute.representationOrder = 3;

    // --------------------- Atributo - Videoclip (Multimedia - Video) ---------------------

    // Representación gráfica
    let videoclipMusicaRepr: MultimediaRepresentation = new MultimediaRepresentation();
    videoclipMusicaRepr.dimensions = [75, 100];
    videoclipMusicaRepr.multimediaType = MultimediaType.Video;

    // Tipo = Categoria (Texto) + Representación gráfica
    let videoclipMusicaType: Type = new Type();
    videoclipMusicaType.representation = muestraMusicaRepr;
    videoclipMusicaType.category = Category.Multimedia;
    
    let videoclipMusicaAttribute: Attribute = new Attribute();
    videoclipMusicaAttribute.type = videoclipMusicaType;
    videoclipMusicaAttribute.tag = "Videoclip";
    videoclipMusicaAttribute.showTag = true;
    videoclipMusicaAttribute.representationOrder = 4;

    // --------------------- Atributo - Activo (Toogle) ---------------------

    // Representación gráfica
    let enActivoMusicaRepr: ToggleRepresentation = new ToggleRepresentation();
    enActivoMusicaRepr.toggleType = ToggleType.Icon;
    enActivoMusicaRepr.icon = IconSelected.Star;
    enActivoMusicaRepr.colorTrue = "#FFFF00";
    enActivoMusicaRepr.colorFalse = "#FF0000";

    // Tipo = Categoria (Texto) + Representación gráfica
    let enActivoMusicaType: Type = new Type();
    enActivoMusicaType.representation = enActivoMusicaRepr;
    enActivoMusicaType.category = Category.Toggle;
    
    let enActivoMusicaAttribute: Attribute = new Attribute();
    enActivoMusicaAttribute.type = enActivoMusicaType;
    enActivoMusicaAttribute.tag = "Activo";
    enActivoMusicaAttribute.showTag = true;
    enActivoMusicaAttribute.representationOrder = 5;


    // --------------------------- Fin atributos ------------------------------

    // Plantilla: guarda cada uno de los atributoss
    let templateMusica: Template = new Template();
    templateMusica.attributes = [
      albumMusicaAttribute,
      grupoMusicaAttribute,
      enActivoMusicaAttribute,
      discograficaMusicaAttribute,
      videoclipMusicaAttribute,
      muestraMusicaAttribute,
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
