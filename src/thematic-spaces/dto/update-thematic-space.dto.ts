import { PartialType } from '@nestjs/mapped-types';
import { CreateThematicSpaceDto } from './create-thematic-space.dto';

export class UpdateThematicSpaceDto extends PartialType(CreateThematicSpaceDto) {}
