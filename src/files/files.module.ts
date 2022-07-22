import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
          JWT_SECRET: Joi.string().required(),
          AWS_S3_REGION: Joi.string().required(),
          AWS_S3_BUCKET_NAME: Joi.string().required(),
          AWS_S3_ACCESS_KEY_ID: Joi.string().required(),
          AWS_S3_SECRET_ACCESS_KEY: Joi.string().required()
      }),
      envFilePath: ".env"
  }),
  ],
  controllers: [FilesController],
  providers: [FilesService]
})
export class FilesModule {}
