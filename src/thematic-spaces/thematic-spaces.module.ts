import { Module } from '@nestjs/common';
import { ThematicSpacesService } from './thematic-spaces.service';
import { ThematicSpacesController } from './thematic-spaces.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ThematicSpace, ThematicSpaceSchema} from "./models/ThematicSpace";
import {ThematicSpaceRepository} from "./repositories/ThematicSpaceRepository";
import { DatabaseModule } from '@app/common';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { 
        name: ThematicSpace.name,
        schema: ThematicSpaceSchema 
      }])],
  controllers: [ThematicSpacesController],
  providers: [ThematicSpacesService, ThematicSpaceRepository],
  exports: [ThematicSpacesService]
})
export class ThematicSpacesModule {}
