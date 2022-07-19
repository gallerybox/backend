import {Body, Controller, Delete, Get, Inject, Param, Patch, Post} from '@nestjs/common';
import {TematicSpacesService} from './tematic-spaces.service';
import {CreateTematicSpaceDto} from './dto/create-tematic-space.dto';
import {UpdateTematicSpaceDto} from './dto/update-tematic-space.dto';
import {ThematicSpace} from "./models/ThematicSpace";
import {Template} from "./models/Template";
import {Attribute} from "./models/Attribute";
import {Category, TextRepresentation, Type} from "./models/Type";
import {ThematicSpaceRepository} from "./repositories/ThematicSpaceRepository";

@Controller('tematic-spaces')
export class TematicSpacesController {

  @Inject()
  thematicSpaceRepository: ThematicSpaceRepository;

  constructor(private readonly tematicSpacesService: TematicSpacesService) {}

  @Post()
  create(@Body() createTematicSpaceDto: CreateTematicSpaceDto) {
    return this.tematicSpacesService.create(createTematicSpaceDto);
  }

  @Get()
  findAll() {
    return this.tematicSpacesService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.tematicSpacesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTematicSpaceDto: UpdateTematicSpaceDto) {
    return this.tematicSpacesService.update(+id, updateTematicSpaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tematicSpacesService.remove(+id);
  }


  @Get("tests")
  async test(){
    let representation: TextRepresentation = new TextRepresentation();
    representation.bold = true;
    representation.font = "MehFont";
    representation.color = "#403E28";
    representation.italics =  true;
    representation.maxLength = 20;
    representation.Size = 15;


    let type_ : Type = new Type();
    type_.representation = representation;
    type_.category = Category.Text;


    let attribute: Attribute = new Attribute();
    attribute.type = type_;
    attribute.tag = "My silly attribute TAG";
    attribute.showTag = true;
    attribute.representationOrder = 0;

    let template: Template = new Template();
    template.attributes = [attribute];

    let thematicSpace: ThematicSpace = await this.thematicSpaceRepository.add({
      template: template,
      name: "Testing thematic space",
      description: "This is the description of the thematic space, for testing purposes"
    });

        //await this.shittyModelRepository.add({name: "Nombre"+random, age: 23, breed: "meh"});

    return thematicSpace;

  }

}
