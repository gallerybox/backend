import { Test, TestingModule } from '@nestjs/testing';
import { CollectibleController } from './collectible.controller';
import { CollectibleService } from './collectible.service';

describe('CollectibleController', () => {
  let controller: CollectibleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectibleController],
      providers: [CollectibleService],
    }).compile();

    controller = module.get<CollectibleController>(CollectibleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
