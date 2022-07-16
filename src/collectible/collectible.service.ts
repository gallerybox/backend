import { Injectable } from '@nestjs/common';
import { CreateCollectibleDto } from './dto/create-collectible.dto';
import { UpdateCollectibleDto } from './dto/update-collectible.dto';

@Injectable()
export class CollectibleService {
  create(createCollectibleDto: CreateCollectibleDto) {
    return 'This action adds a new collectible';
  }

  findAll() {
    return `This action returns all collectible`;
  }

  findOne(id: number) {
    return `This action returns a #${id} collectible`;
  }

  update(id: number, updateCollectibleDto: UpdateCollectibleDto) {
    return `This action updates a #${id} collectible`;
  }

  remove(id: number) {
    return `This action removes a #${id} collectible`;
  }
}
