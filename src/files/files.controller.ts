import { Controller, Delete, Param, Post, Req, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {

    constructor(
        private readonly filesService: FilesService,
    ) {}

    @Post('upload-file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.filesService.uploadFile(file);
    }

    @Post('upload-files')
    @UseInterceptors(AnyFilesInterceptor())
    async uploadFiles (@UploadedFiles() files: Array<Express.Multer.File>)  {
        return await this.filesService.uploadFiles(files); 
    }

    @Delete('delete/:filename')
    async deleteFile(@Param('filename') filename: string){
        return this.filesService.deleteFile(filename);
    }
 
}
