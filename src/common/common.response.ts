import {HttpStatus} from "@nestjs/common";
import {classToPlain} from "class-transformer";

export class CommonResponse<T> {
    private readonly statusCode: number;
    private readonly message: string;
    private readonly data: Record<string, any>;

    constructor(status: number, data: T) {
        this.statusCode = status;
        this.message = HttpStatus[status];
        this.data = classToPlain(data);
    }
}