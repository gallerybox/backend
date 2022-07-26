import { Module } from '@nestjs/common';
import { CollectibleService } from './collectible.service';
import { CollectibleController } from './collectible.controller';
import { CollectibleRepository } from "./repositories/CollectibleRepository";
import { DatabaseModule } from "@app/common/database_simpler/database.module";
import { MongooseModule } from "@nestjs/mongoose";1
import { Collectible, CollectibleSchema } from "./models/Collectible";
import { ThematicSpacesModule as ThematicSpacesModule } from "../thematic-spaces/thematic-spaces.module";
import { UsersModule } from 'src/users/users.module';

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
    ],
  controllers: [CollectibleController],
  providers: [CollectibleService, CollectibleRepository],
})
export class CollectibleModule {}
