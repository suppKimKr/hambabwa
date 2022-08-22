import { Controller, Post, Body } from '@nestjs/common';
import {ApiOperation} from "@nestjs/swagger";
import {UserService} from "../user/user.service";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {User} from "../user/entities/user.entity";

@Controller('auth')
export class AuthController {
  constructor(
      private readonly userService: UserService,
  ) {}

  @Post("signup")
  @ApiOperation({ summary: "회원가입" })
  async register(
      @Body() userInput: CreateUserDto
  ): Promise<User> {
    return this.userService.signup(userInput);
  }
}
