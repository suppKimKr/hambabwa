import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import * as Joi from "@hapi/joi";

@Module({
  imports: [
      ConfigModule.forRoot({
        envFilePath: `config/.env.${process.env.NODE_ENV}`,
        isGlobal: true,
        validationSchema: Joi.object({
            MYSQL_HOST: Joi.string().required(),
            MYSQL_PORT: Joi.number().required(),
            MYSQL_USER: Joi.string().required(),
            MYSQL_PASSWORD: Joi.string().required(),
            MYSQL_DB: Joi.string().required(),
            PORT: Joi.number(),
        }),
      }),
      DatabaseModule,
      UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
