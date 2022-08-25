import {Controller, Post, Body, Res, UseGuards} from '@nestjs/common';
import {ApiOperation} from "@nestjs/swagger";
import {UserService} from "../user/user.service";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {User} from "../user/entities/user.entity";
import {LoginRequestDto} from "./dto/login.request.dto";
import {AuthService} from "./auth.service";
import {Response} from "express";
import {LocalAuthGuard} from "./guards/local-auth.guard";

@Controller('auth')
export class AuthController {
  constructor(
      private readonly userService: UserService,
      private readonly authService: AuthService,
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

}
