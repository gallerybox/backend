import { Module } from '@nestjs/common';
import { ThematicSpacesService } from './thematic-spaces.service';
import { ThematicSpacesController } from './thematic-spaces.controller';
import {DatabaseModule} from "@app/common/database_simpler/database.module";
import {MongooseModule} from "@nestjs/mongoose";
import {ThematicSpace, ThematicSpaceSchema} from "./models/ThematicSpace";
import {ThematicSpaceRepository} from "./repositories/ThematicSpaceRepository";

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
