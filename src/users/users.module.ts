import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schema/users.schema';
import { UsersRepository } from './users.repository';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { FilesModule } from 'src/files/files.module';
import { MailModule } from 'src/mail/mail.module';
import {CollectibleService} from "../collectible/collectible.service";
import {CollectibleModule} from "../collectible/collectible.module";

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
          MONGO_ROOT_USERNAME: Joi.string().required(),
          MONGO_ROOT_PASSWORD: Joi.string().required(),
          MONGO_HOST: Joi.string().required(),
          MONGO_HOST_PORT: Joi.string().required()
      }),
      envFilePath: ".env"
  }),
    MongooseModule.forFeature([
      {
        name: Users.name, schema: UsersSchema
      }
    ]),
    FilesModule,
    MailModule
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
