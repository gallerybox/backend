import { Controller, Delete, HttpException, HttpStatus, Param, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {

    constructor(
        private readonly filesService: FilesService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('upload-file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        
        if (!file)
            throw new HttpException("El fichero no existe", HttpStatus.NOT_FOUND)

        return this.filesService.uploadFile(file);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload-files')
    @UseInterceptors(AnyFilesInterceptor())
    async uploadFiles (@UploadedFiles() files: Array<Express.Multer.File>)  {
        
        if (!files || files.length === 0)
            throw new HttpException("No se han enviado ficheros", HttpStatus.NOT_FOUND)

        return await this.filesService.uploadFiles(files); 
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:filename')
    async deleteFile(@Param('filename') filename: string){
        return this.filesService.deleteFile(filename);
    }
 
}
