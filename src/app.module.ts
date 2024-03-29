import { DatabaseModule } from '@app/common/database/database.module';
import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { ThematicSpacesModule } from './thematic-spaces/thematic-spaces.module';
import { CollectibleModule } from './collectible/collectible.module';
import { FilesModule as FilesModule } from './files/files.module';
import { MailModule } from './mail/mail.module';
import { ProfileModule } from './profile/profile.module';
import {ErrorInterceptor} from "./middlewares";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({

        // Nestjs - Backend

        NODE_ENV: Joi.string().required(),
        NESTJS_PORT: Joi.number().required(),
        NESTJS_DEBUG_PORT: Joi.number().required(),

        // MongoDB Database
        
        MONGO_ROOT_USERNAME: Joi.string().required(),
        MONGO_ROOT_PASSWORD: Joi.string().required(),
        MONGO_HOST: Joi.string().required(),
        MONGO_HOST_PORT: Joi.number().required()
        
      }),
      envFilePath: '.env'
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ThematicSpacesModule,
    CollectibleModule,
    FilesModule,
    MailModule,
    ProfileModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(ErrorInterceptor)
        .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}