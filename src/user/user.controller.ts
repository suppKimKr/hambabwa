import {Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import { UserService } from './user.service';
import {ApiConsumes, ApiOperation, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/guards";
import {RequestWithUser} from "../auth/interfaces";
import {FileInterceptor} from "@nestjs/platform-express";
import {UpdateUserDto} from "./dto/update-user.dto";
import {User} from "./entities/user.entity";

@Controller('user')
@ApiTags("user")
export class UserController {
  constructor(
      private readonly userService: UserService
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(
      @Req() { user }: RequestWithUser,
  ): Promise<User> {
    return user;
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('imageUrl'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: "본인정보 수정 API" })
  async updateProfile(
    @Req() { user }: RequestWithUser,
    @Body() userInput: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<User> {
    return await this.userService.updateProfile(user, userInput, file);
  }
}
