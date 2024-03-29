import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/common';
import { MongooseModule } from "@nestjs/mongoose";
import { ThematicSpace, ThematicSpaceSchema } from "./models/ThematicSpace";
import { Attribute, AttributeSchema } from './models/Attribute';
import { Template, TemplateSchema } from './models/Template';
import { Type, TypeSchema } from './models/Type';

import { ThematicSpacesController } from './thematic-spaces.controller';
import { ThematicSpacesService } from './thematic-spaces.service';
import { ThematicSpaceRepository } from "./repositories/thematic-spaces.repository";
import { UsersModule } from 'src/users/users.module';
import { CollectibleModule } from 'src/collectible/collectible.module';

@Module({
  imports: [
    DatabaseModule,                   // Conexión de base de datos
    MongooseModule.forFeature([       // Registro de esquemas
      { 
        name: ThematicSpace.name,
        schema: ThematicSpaceSchema
      }, 
      {
        name: Attribute.name,
        schema: AttributeSchema
      },
      {
        name: Template.name,
        schema: TemplateSchema
      },
      {
        name: Type.name,
        schema: TypeSchema
      }
    ]),
    UsersModule
  ],
  controllers: [ThematicSpacesController],
  providers: [ThematicSpacesService, ThematicSpaceRepository],
  exports: [ThematicSpacesService]
})
export class ThematicSpacesModule {}
