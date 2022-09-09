import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigService} from "@nestjs/config";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";

@Module({
  imports: [
      TypeOrmModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          type: 'mysql',
          host: configService.get('MYSQL_HOST'),
          port: configService.get('MYSQL_PORT'),
          username: configService.get('MYSQL_USER'),
          password: configService.get('MYSQL_PASSWORD'),
          database: configService.get('MYSQL_DB'),
          logging: true,
          entities: [
            __dirname + '/../**/*.entity{.ts,.js}'
          ],
          timezone: 'Z',
          synchronize: true,
          cache: {
            type: "redis",
            options: {
              host: configService.get('REDIS_HOST'),
              port: configService.get('REDIS_PORT'),
            }
          },
          namingStrategy: new SnakeNamingStrategy(),
        }),
      }),
  ],
})
export class DatabaseModule {}
