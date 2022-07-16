import { Test, TestingModule } from '@nestjs/testing';
import { CollectibleService } from './collectible.service';

describe('CollectibleService', () => {
  let service: CollectibleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectibleService],
    }).compile();

    service = module.get<CollectibleService>(CollectibleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
