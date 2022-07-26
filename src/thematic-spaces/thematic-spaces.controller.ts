import {Body, Controller, Delete, Get, Inject, Param, Patch, Post} from '@nestjs/common';
import {ThematicSpacesService} from './thematic-spaces.service';
import {CreateThematicSpaceDto} from './dto/create-thematic-space.dto';
import {UpdateThematicSpaceDto} from './dto/update-thematic-space.dto';
import {ThematicSpace} from "./models/ThematicSpace";
import {Template} from "./models/Template";
import {Attribute} from "./models/Attribute";
import {Category, TextRepresentation, Type} from "./models/Type";
import {ThematicSpaceRepository} from "./repositories/ThematicSpaceRepository";

@Controller('thematic-spaces')
export class ThematicSpacesController {

  constructor(
    private readonly thematicSpacesService: ThematicSpacesService
  ) {}

  @Post()
  create(@Body() createThematicSpaceDto: CreateThematicSpaceDto) {
    return this.thematicSpacesService.create(createThematicSpaceDto);
  }

  @Get()
  findAll() {
    return this.thematicSpacesService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.thematicSpacesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateThematicSpaceDto: UpdateThematicSpaceDto) {
    return this.thematicSpacesService.update(+id, updateThematicSpaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thematicSpacesService.remove(+id);
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
