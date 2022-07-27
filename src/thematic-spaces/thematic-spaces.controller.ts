import {Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req} from '@nestjs/common';
import {ThematicSpacesService} from './thematic-spaces.service';
import {ThematicSpace} from "./models/ThematicSpace";
import {Template} from "./models/Template";
import {Attribute} from "./models/Attribute";
import {Category, TextRepresentation, Type} from "./models/Type";
import {ThematicSpaceRepository} from "./repositories/ThematicSpaceRepository";
import { Request } from 'express';

@Controller('thematic-spaces')
export class ThematicSpacesController {

  constructor(
    private readonly thematicSpacesService: ThematicSpacesService
  ) {}

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

  @Patch(':id')
  async update(@Param('id') id: string, /**@Body() updateThematicSpaceDto: UpdateThematicSpaceDto**/) {
    return await this.thematicSpacesService.update(id /*, updateThematicSpaceDto*/);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.thematicSpacesService.remove(id);
  }


  // @Get("tests")
  // async test(){
  //   let representation: TextRepresentation = new TextRepresentation();
  //   representation.bold = true;
  //   representation.font = "MehFont";
  //   representation.color = "#403E28";
  //   representation.italics =  true;
  //   representation.maxLength = 20;
  //   representation.Size = 15;


  //   let type_ : Type = new Type();
  //   type_.representation = representation;
  //   type_.category = Category.Text;


  //   let attribute: Attribute = new Attribute();
  //   attribute.type = type_;
  //   attribute.tag = "My silly attribute TAG";
  //   attribute.showTag = true;
  //   attribute.representationOrder = 0;

  //   let template: Template = new Template();
  //   template.attributes = [attribute];

  //   let thematicSpace: ThematicSpace = await this.thematicSpaceRepository.add({
  //     template: template,
  //     name: "Testing thematic space",
  //     description: "This is the description of the thematic space, for testing purposes"
  //   });

  //       //await this.shittyModelRepository.add({name: "Nombre"+random, age: 23, breed: "meh"});

  //   return thematicSpace;

  // }

}
