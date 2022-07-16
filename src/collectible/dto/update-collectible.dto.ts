import { PartialType } from '@nestjs/mapped-types';
import { CreateCollectibleDto } from './create-collectible.dto';

export class UpdateCollectibleDto extends PartialType(CreateCollectibleDto) {}
