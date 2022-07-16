import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                // Todo: falta por añadir el nombre de la base de datos
                uri: 'mongodb://' + configService.get<string>('MONGO_ROOT_USERNAME') + ":" + configService.get<string>('MONGO_ROOT_PASSWORD') +
                    '@' + configService.get<string>('MONGO_HOST') || 27017 + ':' +  configService.get<string>('MONGO_HOST_PORT') + "/pepe"
            }),
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
