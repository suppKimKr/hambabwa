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

@Controller('auth')
export class AuthController {
  constructor(
      private readonly userService: UserService,
      private readonly authService: AuthService,
      private readonly configService: ConfigService,
  ) {}

  @Post("signup")
  @ApiOperation({ summary: "회원가입" })
  async register(
      @Body() userInput: CreateUserDto
  ): Promise<User> {
    return this.userService.signup(userInput);
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ApiOperation({summary: "로그인"})
  async login(
    @Body() userInput: LoginRequestDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<User> {
    const userInfo = await this.authService.login(userInput);
    const { accessToken, ...accessOptions } = this.authService.getCookieWithJwtToken(userInfo);
    const { refreshToken, ...refreshOptions } = this.authService.getCookieWithJwtRefreshToken(userInfo);

    res.cookie("Auth", accessToken, accessOptions);
    res.cookie("Refresh", refreshToken, refreshOptions);

    await this.userService.setCurrentRefreshToken(refreshToken, userInfo);
    return userInfo;
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
