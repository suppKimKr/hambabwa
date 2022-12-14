import {Controller, Post, Body, Res, UseGuards, Req, Get} from '@nestjs/common';
import {ApiOperation} from "@nestjs/swagger";
import {UserService} from "../user/user.service";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {User} from "../user/entities/user.entity";
import {LoginRequestDto} from "./dto/login.request.dto";
import {AuthService} from "./auth.service";
import {Response} from "express";
import {JwtRefreshGuard, LocalAuthGuard} from "./guards";
import {RequestWithUser} from "./interfaces";
import {ConfigService} from "@nestjs/config";
import {MailService} from "../mail/mail.service";

@Controller('auth')
export class AuthController {
  constructor(
      private readonly userService: UserService,
      private readonly authService: AuthService,
      private readonly configService: ConfigService,
      private readonly mailService: MailService,
  ) {}

  @Post("signup")
  @ApiOperation({ summary: "회원가입" })
  async register(
      @Body() userInput: CreateUserDto
  ): Promise<User> {
    const user = await this.userService.signup(userInput);
    await this.mailService.sendWelcomeMail(user);
    return user;
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ApiOperation({summary: "로그인"})
  async login(
    @Req() { user }: RequestWithUser,
    @Body() userInput: LoginRequestDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<User> {
    const { accessToken, ...accessOptions } = this.authService.getCookieWithJwtToken(user);
    const { refreshToken, ...refreshOptions } = this.authService.getCookieWithJwtRefreshToken(user);

    res.cookie("Auth", accessToken, accessOptions);
    res.cookie("Refresh", refreshToken, refreshOptions);

    await this.userService.setCurrentRefreshToken(refreshToken, user);
    return user;
  }

  @Post("logout")
  @ApiOperation({ summary: "로그아웃" })
  @UseGuards(JwtRefreshGuard)
  async logout(
      @Req() { user }: RequestWithUser,
      @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    await this.userService.removeRefreshToken(user.id);

    res.cookie("Auth", "", {
      domain: this.configService.get('AUTH_DOMAIN'),
      path: '/',
      maxAge: 0,
      httpOnly: true,
    });
    res.cookie("Refresh", "", {
      domain: this.configService.get('AUTH_DOMAIN'),
      path: '/',
      maxAge: 0,
      httpOnly: true,
    });
  }

  @Get("refresh")
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: "refresh 토큰으로 access 토큰 재발급" })
  refresh(
      @Req() { user }: RequestWithUser,
      @Res({ passthrough: true }) res: Response
  ): User {
    const { accessToken, ...accessOption } = this.authService.getCookieWithJwtToken(user);
    res.cookie("Auth", accessToken, accessOption);

    return user;
  }
}
