import {Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req} from '@nestjs/common';
import {ThematicSpacesService} from './thematic-spaces.service';
import {ThematicSpace} from "./models/ThematicSpace";
import {Template} from "./models/Template";
import {Attribute} from "./models/Attribute";
import {Category, TextRepresentation, Type} from "./models/Type";
import {ThematicSpaceRepository} from "./repositories/thematic-spaces.repository";
import { Request } from 'express';

@Controller('thematic-spaces')
export class ThematicSpacesController {

  constructor(
    private readonly thematicSpacesService: ThematicSpacesService,
    private readonly thematicSpacesRepository: ThematicSpaceRepository
  ) {}

  // TODO: - ThematicSpaceController - Create
  @Post()
  async create(@Req() request: Request) {
    // return await this.thematicSpacesService.create(request.body);
  }

  @Get()
  async findAll() {
    return await this.thematicSpacesService.findAll();
  }

  @Get('id/:id')
  async findOneById(@Param('id') id: string) {
    return await this.thematicSpacesService.findOneById(id);
  }

  // Todo - ThematicSpaceController - Update
  @Patch(':id')
  async update(@Param('id') id: string, /**@Body() updateThematicSpaceDto: UpdateThematicSpaceDto**/) {
   //  return await this.thematicSpacesService.update(id /*, updateThematicSpaceDto*/);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.thematicSpacesService.remove(id);
  }


  @Get("tests")
  async test(){
    // Categoria texto - Representación
    let representation: TextRepresentation = new TextRepresentation();
    representation.bold = true;
    representation.font = "PedroloFont";
    representation.color = "#403E28";
    representation.italics =  true;
    representation.maxLength = 20;
    representation.Size = 15;

    // Categoria texto 
    let type_ : Type = new Type();
    type_.representation = representation;    // Se guarda la reprensetacion
    type_.category = Category.Text;

    // Atributo texto
    let attribute: Attribute = new Attribute();
    attribute.type = type_;
    attribute.tag = "Salario";
    attribute.showTag = true;
    attribute.representationOrder = 0;

    // Template
    let template: Template = new Template();
    template.attributes = [attribute];        // Se guarda el atributo en la template


    let thematicSpace: ThematicSpace = await this.thematicSpacesRepository.add({
      template: template,
      name: "TematicSpaceUserPedrolo",
      description: "Thematic Space Description"
    });

        //await this.shittyModelRepository.add({name: "Nombre"+random, age: 23, breed: "meh"});

    return thematicSpace;

  }

}
