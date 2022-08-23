import {Injectable, UnauthorizedException} from '@nestjs/common';
import {LoginRequestDto} from "./dto/login.request.dto";
import {ReadOnlyUserData, User} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";
import * as bcrypt from "bcrypt";
import {TokenPayload, ResponseWithCookie} from "./interfaces";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
       private readonly userService: UserService,
       private readonly jwtService: JwtService,
       private readonly configService: ConfigService,
    ) {}

    async login(userInput: LoginRequestDto): Promise<User> {
        const { email, password } = userInput;
        const user = await this.userService.findUserByEmail(email);

        const isPasswordValidated: boolean = await bcrypt.compare(
            password,
            user.password
        );

        if (user && isPasswordValidated) return user;
        throw new UnauthorizedException("이메일, 비밀번호를 확인해주세요.");
    }

    async validateUser(email: string, password: string): Promise<ReadOnlyUserData | null> {
        const user = await this.userService.findUserByEmail(email);
        const isPasswordValidated: boolean = await bcrypt.compare(password, user.password);

        if (user && isPasswordValidated) {
            const { password, ...userInfo } = user;
            return userInfo;
        }

        return null;
    }

    getCookieWithJwtToken({ email, id }: User): ResponseWithCookie {
        const payload: TokenPayload = { email, id };
        const token: string = this.jwtService.sign(payload, {
            secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
            expiresIn: `${this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME")}s`,
        });

        return {
            accessToken: token,
            domain: this.configService.get("AUTH_DOMAIN"),
            path: "/",
            httpOnly: true,
            maxAge: this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME") * 1000,
            sameSite: this.configService.get("SAME_SITE_OPTION"),
            secure: true,
        }
    }

    getCookieWithJwtRefreshToken({ email, id }: User): ResponseWithCookie {
        const payload: TokenPayload = { email, id };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: `${this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME")}s`,
        });

        return {
            refreshToken: token,
            domain: this.configService.get("AUTH_DOMAIN"),
            path: "/",
            httpOnly: true,
            maxAge:
                this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME") * 1000,
            sameSite: this.configService.get("SAME_SITE_OPTION"),
            secure: true,
        };
    }
}

