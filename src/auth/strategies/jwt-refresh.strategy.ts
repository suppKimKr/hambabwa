import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ConfigService} from "@nestjs/config";
import {ExtractJwt, Strategy} from "passport-jwt";
import {UserService} from "../../user/user.service";
import {TokenPayload} from "../interfaces";
import {Request} from "express";
import {User} from "../../user/entities/user.entity";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy,"jwt-refresh") {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    return request?.cookies?.Refresh;
                },
            ]),
            secretOrKey: configService.get("JWT_REFRESH_TOKEN_SECRET"),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: TokenPayload): Promise<User> {
        const refreshToken = req.cookies?.Refresh;
        return this.usersService.getUserIfRefreshTokenMatches(
            refreshToken,
            payload.id
        );
    }
}