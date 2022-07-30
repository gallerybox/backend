import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3, config } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
/** TODO
 * - Investigar ACL (Access Control List): hace que su archivo sea legible para el 
 *   público. De lo contrario, muestra "Access denied".
 * 
 *   https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html
 *
 * - ContentDisposition: "inline" y ContentType: mimetype: para que el navegador vea 
 *   su fichero PERO no lo descargue.
 * 
 * - ¿Qué hacer cuando se actualiza un objeto?
 *   · Lo + fácil: el usuario primero borra el objeto y luego sube el nuevo.
 *   · Lo + complejo: actualizar el fichero por el nuevo. ¿Qué podría hacer por detrás?
 * 
 * Más información: https://dev.to/vjnvisakh/uploading-to-s3-using-nestjs-4037
 */

@Injectable()
export class FilesService {

    constructor (
        private readonly configService: ConfigService
    ) {
        config.update({
            accessKeyId: configService.get<string>('AWS_S3_ACCESS_KEY_ID'),
            secretAccessKey: configService.get<string>('AWS_S3_SECRET_ACCESS_KEY'),
            region: configService.get<string>('AWS_S3_REGION')
        })
    }

    // Sube un fichero a AWS S3
    async uploadFile(file: Express.Multer.File) {
        let result = [];

        const s3 = new S3();

        const s3FileInfo = {
            Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
            Key: `${uuid()}-${file.originalname}`,
            Body: file.buffer,
            FieldName: file.fieldname
        }
        
        // Subiendo el nuevo fichero al bucket
        result.push(await s3.upload(s3FileInfo)
            .promise()
            .then(data => {
                return {
                    ETag: data.ETag,
                    Fieldname: s3FileInfo.FieldName,
                    Location: data.Location,
                    key: data.Key,
                    Key: data.Key,
                    Bucket: data.Bucket
                }
            })
            .catch(err => {
                if (err.code === 'SignatureDoesNotMatch'){
                    throw new HttpException("Bad AWS S3 Credentials", HttpStatus.FORBIDDEN);
                }
                console.log(err);
            }));
        return result;
    }

    async uploadFiles(files: Array<Express.Multer.File>) {
        const s3 = new S3();

        const params = files.map((file) => {
            return {
                Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
                Key: `${uuid()}-${file.originalname}`,
                Body: file.buffer,
                FieldName: file.fieldname
            }
        });



        return await Promise.all(params.map(async s3FileInfo => {
            return await s3.upload(s3FileInfo).promise()
                .then(data => {
                    return {
                        ETag: data.ETag,
                        Fieldname: s3FileInfo.FieldName,
                        Location: data.Location,
                        key: data.Key,
                        Key: data.Key,
                        Bucket: data.Bucket
                    }
                } )
                .catch(err => {
                    if (err.code === 'SignatureDoesNotMatch'){
                        throw new HttpException("Bad AWS S3 Credentials", HttpStatus.FORBIDDEN);
                    }
                    console.log(err);
                });
        }));
    }


    // Borra un fichero en AWS S3
    async deleteFile(fileUrl: string) {
        let result = null;

        let objectData = {
            Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
            Key: fileUrl // fileURL
        }
        
        const s3 = new S3();
        
        if (!await this.checkIfFileExistsInAwsS3(objectData)){
            throw new HttpException("File not found or does not exists", HttpStatus.NOT_FOUND)
        } else {
            await s3.deleteObject(objectData)
            .promise()
            .catch(err => {
                console.log(err);
            });
        }

        // Faltaría borrar en base de datos
    }

    private async checkIfFileExistsInAwsS3(params: {Bucket: string, Key: string}): Promise<boolean>{
        let result = true;

        const s3 = new S3();

        await s3.headObject(params)
        .promise()
        .catch(err => {
            // Si err.code === 'NotFound', el fichero no existe
            if (err.code === 'Forbidden')
                throw new HttpException("Bad AWS S3 Credentials", HttpStatus.FORBIDDEN);
            
            result = false;
        });

        return result;
    }
}
