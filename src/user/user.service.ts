import {CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {CreateUserDto} from "./dto/create-user.dto";
import {compare, hash} from "bcryptjs";
import {UpdateUserDto} from "./dto/update-user.dto";
import {FilesService} from "../files/files.service";
import {ConfigService} from "@nestjs/config";
import { Cache } from "cache-manager";
import {generateRedisKey} from "../common/functions/generate.redis.key";

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly filesService: FilesService,
      private readonly configService: ConfigService,
      @Inject(CACHE_MANAGER)
      private readonly cacheManager: Cache
  ) {}

  async signup(userInput: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(userInput);
    return await this.userRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({email});
    if (user) return user;
    throw new HttpException(
        "User with this email does not exists",
        HttpStatus.NOT_FOUND,
    )
  }

  async setCurrentRefreshToken(refreshToken: string, user: User): Promise<void> {
    const hashedRefreshToken = await hash(refreshToken, 10);
    const key = generateRedisKey('User', user.id);
    await this.cacheManager.set(key, hashedRefreshToken, this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'));
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (user) return user;
    throw new HttpException(
        "User with this id does not exists",
        HttpStatus.NOT_FOUND,
    )
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, id: number): Promise<User> {
    const key = generateRedisKey('User', id);
    const hashedRefreshToken = await this.cacheManager.get(key);
    const isRefreshTokenMatching = await compare(refreshToken, hashedRefreshToken);

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException("Not found user for refresh token.");
    }
    return this.userRepository.create({ id });
  }

  async removeRefreshToken(id: number): Promise<User> {
    const user = this.userRepository.create({id, currentHashedRefreshToken: null});
    return await this.userRepository.save(user);
  }

  async updateProfile(user: User, userInput: UpdateUserDto, file?: Express.Multer.File): Promise<User> {
    const updatedUser = this.userRepository.create({
      id: user.id,
      ...userInput,
    });

    if(file) {
      const { Key } = await this.filesService.uploadFile(file, 'profile');
      user.imageUrl = this.configService.get('AWS_S3_IMAGE_URL') + Key;
    }

    return await this.userRepository.save(updatedUser);
  }
}
