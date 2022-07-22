import { Controller, Delete, HttpException, Param, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {

    constructor(
        private readonly filesService: FilesService
    ) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(/*@Req() request: DTOPendient3, */@UploadedFile() file: Express.Multer.File) {
        return this.filesService.uploadFile(file.buffer, file.originalname)
    }

    @Delete('delete/:filename')
    async deleteFile(@Param('filename') filename: string){
        return this.filesService.deleteFile(filename);
    }
 
}
