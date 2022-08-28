import {OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor} from "@nestjs/bull";
import {MailService} from "./mail.service";
import {Job} from "bull";
import {User} from "../user/entities/user.entity";

@Processor('sendMail')
export class MailProcessor {
    constructor(
       private readonly mailService: MailService,
    ) {}

    @OnQueueActive()
    onActive(job: Job): void {
        console.log(`Processor: @OnQueueActive - Processing job ${job.id} of type ${job.name}.
        Data: ${JSON.stringify(job.data)}`
        );
    }

    @OnQueueCompleted()
    onComplete(job: Job): void {
        console.log(
            `Processor:@OnQueueCompleted - Completed job ${job.id} of type ${job.name}.`,
        );
    }

    @OnQueueFailed()
    onError(job: Job, error: Error): void {
        console.log(
            `Processor:@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.message}`,
            error.stack,
        );
    }

    @Process('welcome')
    async sendWelcomeEmail({ data }: Job): Promise<any> {
        console.log('Processor:@Process - Sending Welcome mail.');
        try {
            return await this.mailService.sendUserWelcomeMail(data as User);
        } catch (e) {
            console.error('Failed to send Welcome mail.', e.stack);
            throw e;
        }
    }

}