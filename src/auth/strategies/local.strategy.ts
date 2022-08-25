import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {AuthService} from "../auth.service";
import {ReadOnlyUserData} from "../../user/entities/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(
        private authService: AuthService
    ) {
        super({
            usernameField: "email",
        });
    }

    async validate(email: string, password: string): Promise<ReadOnlyUserData> {
        const user = await this.authService.validateUser(email, password);
        if (!user) throw new HttpException("Please check email or password", HttpStatus.BAD_REQUEST);
        return user;
    }
}