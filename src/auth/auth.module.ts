import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {JwtRefreshStrategy, JwtStrategy, LocalStrategy} from "./strategies";
import {PassportModule} from "@nestjs/passport";
import {MailModule} from "../mail/mail.module";

@Module({
  imports: [
      UserModule,
      PassportModule,
      MailModule,
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
  providers: [
      AuthService,
      LocalStrategy,
      JwtStrategy,
      JwtRefreshStrategy
  ],
})
export class AuthModule {}
