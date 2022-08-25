import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {CreateUserDto} from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
  ) {}

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

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

  async setCurrentRefreshToken(refreshToken: string, user: User): Promise<User> {
    const currentHashedRefreshToken: string = await user.getCurrentRefreshToken(refreshToken);
    const userInstance: User = this.userRepository.create({ ...user, currentHashedRefreshToken });
    return await this.userRepository.save(userInstance);
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
    const user = await this.findUserById(id);
    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken);

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException("Not found user for refresh token.");
    }
    return user;
  }

  async removeRefreshToken(id: number): Promise<User> {
    const user = this.userRepository.create({id, currentHashedRefreshToken: null});
    return await this.userRepository.save(user);
  }
}
