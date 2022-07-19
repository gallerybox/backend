import { Module } from '@nestjs/common';
import { TematicSpacesService } from './tematic-spaces.service';
import { TematicSpacesController } from './tematic-spaces.controller';
import {DatabaseModule} from "@app/common/database_simpler/database.module";
import {MongooseModule} from "@nestjs/mongoose";
import {ThematicSpace, ThematicSpaceSchema} from "./models/ThematicSpace";
import {ThematicSpaceRepository} from "./repositories/ThematicSpaceRepository";

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([{ name: ThematicSpace.name, schema: ThematicSpaceSchema }])],
  controllers: [TematicSpacesController],
  providers: [TematicSpacesService, ThematicSpaceRepository],
  exports: [ThematicSpaceRepository]
})
export class TematicSpacesModule {}
