import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {CreateUserDto} from "./dto/create-user.dto";

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
}
