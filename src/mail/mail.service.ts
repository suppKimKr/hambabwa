import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";
import {User} from "../user/entities/user.entity";
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('sendMail')
    private readonly mailQue: Queue,
    private readonly mailerService: MailerService,
  ) {}

  async sendWelcomeMail(user: User): Promise<boolean> {
    try {
      await this.mailQue.add('welcome', { user });
      return true;
    } catch (e) {
      console.log('Error queueing welcome mail to user');
      return false;
    }
  }

  async sendUserWelcomeMail(user: User): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: `${user.nickname}님, 강남함바 가입을 축하드립니다!`,
        template: './welcome',
        context: {
          name: user.nickname,
        }
      });
      console.log(`Welcome Mail sent to ${user.email}, successfully 🎉`);
    } catch (e) {
      console.log(e);
    }
  }
}
