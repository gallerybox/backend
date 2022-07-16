import { Module } from '@nestjs/common';
import { TematicSpacesService } from './tematic-spaces.service';
import { TematicSpacesController } from './tematic-spaces.controller';

@Module({
  controllers: [TematicSpacesController],
  providers: [TematicSpacesService]
})
export class TematicSpacesModule {}
