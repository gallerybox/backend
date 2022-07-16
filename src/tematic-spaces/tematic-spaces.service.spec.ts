import { Test, TestingModule } from '@nestjs/testing';
import { TematicSpacesService } from './tematic-spaces.service';

describe('TematicSpacesService', () => {
  let service: TematicSpacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TematicSpacesService],
    }).compile();

    service = module.get<TematicSpacesService>(TematicSpacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
