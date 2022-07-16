import { Test, TestingModule } from '@nestjs/testing';
import { TematicSpacesController } from './tematic-spaces.controller';
import { TematicSpacesService } from './tematic-spaces.service';

describe('TematicSpacesController', () => {
  let controller: TematicSpacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TematicSpacesController],
      providers: [TematicSpacesService],
    }).compile();

    controller = module.get<TematicSpacesController>(TematicSpacesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
