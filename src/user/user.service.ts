import { Injectable } from '@nestjs/common';
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
}
