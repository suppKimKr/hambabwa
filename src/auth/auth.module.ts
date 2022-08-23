import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";

@Module({
  imports: [
      UserModule,
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
  providers: [AuthService],
})
export class AuthModule {}
