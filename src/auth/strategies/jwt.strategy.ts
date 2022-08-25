import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Request} from "express";
import {ReadOnlyUserData} from "../../user/entities/user.entity";
import {ConfigService} from "@nestjs/config";
import {TokenPayload} from "../interfaces";
import {UserService} from "../../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Authentication;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get("JWT_ACCESS_TOKEN_SECRET"),
        });
    }

    async validate(payload: TokenPayload): Promise<ReadOnlyUserData> {
        const user = await this.userService.findUserById(payload.id);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}