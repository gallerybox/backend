import { Module } from '@nestjs/common';
import { CollectibleService } from './collectible.service';
import { CollectibleController } from './collectible.controller';
import {CollectibleRepository} from "./repositories/CollectibleRepository";
import {DatabaseModule} from "@app/common/database_simpler/database.module";
import {MongooseModule} from "@nestjs/mongoose";
import {ThematicSpace, ThematicSpaceSchema} from "../tematic-spaces/models/ThematicSpace";
import {Collectible, CollectibleSchema} from "./models/Collectible";
import {TematicSpacesModule} from "../tematic-spaces/tematic-spaces.module";

@Module({
  imports: [ TematicSpacesModule,
      DatabaseModule, MongooseModule.forFeature([{ name: Collectible.name, schema: CollectibleSchema }])],
  controllers: [CollectibleController],
  providers: [CollectibleService, CollectibleRepository]
})
export class CollectibleModule {}
