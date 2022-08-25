import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {LocalStrategy} from "./strategies/local.strategy";
import {PassportModule} from "@nestjs/passport";

@Module({
  imports: [
      UserModule,
      PassportModule,
      JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get("JWT_ACCESS_TOKEN_SECRET"),
          signOptions: {
            expiresIn: `${configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME")}s`,
          },
        }),
      }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
