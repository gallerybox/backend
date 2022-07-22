import { PartialType } from '@nestjs/mapped-types';
import { CreateFileDto as CreateFileDto } from './create-file-upload.dto';

export class UpdateFileDto extends PartialType(CreateFileDto) {}
