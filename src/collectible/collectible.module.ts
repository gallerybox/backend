import { Module } from '@nestjs/common';
import { CollectibleService } from './collectible.service';
import { CollectibleController } from './collectible.controller';

@Module({
  controllers: [CollectibleController],
  providers: [CollectibleService]
})
export class CollectibleModule {}
