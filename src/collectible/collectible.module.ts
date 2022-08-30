import { Module } from '@nestjs/common';
import { CollectibleService } from './collectible.service';
import { CollectibleController } from './collectible.controller';
import { CollectibleRepository } from "./repositories/collectible.repository";
import { MongooseModule } from "@nestjs/mongoose";1
import { Collectible, CollectibleSchema } from "./models/Collectible";
import { ThematicSpacesModule as ThematicSpacesModule } from "../thematic-spaces/thematic-spaces.module";
import { UsersModule } from 'src/users/users.module';
import { FilesModule } from 'src/files/files.module';
import { DatabaseModule } from '@app/common';
import {ProfileModule} from "../profile/profile.module";

@Module({
  imports: [ 
    DatabaseModule, 
    MongooseModule.forFeature([
      { 
        name: Collectible.name, 
        schema: CollectibleSchema 
      }]),
    UsersModule,
    ThematicSpacesModule,
    FilesModule
    ],
  controllers: [CollectibleController],
  providers: [CollectibleService, CollectibleRepository],
  exports: [CollectibleService]
})
export class CollectibleModule {}
