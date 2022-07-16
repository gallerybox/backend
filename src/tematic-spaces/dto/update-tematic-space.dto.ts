import { PartialType } from '@nestjs/mapped-types';
import { CreateTematicSpaceDto } from './create-tematic-space.dto';

export class UpdateTematicSpaceDto extends PartialType(CreateTematicSpaceDto) {}
