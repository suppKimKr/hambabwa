import {ApiProperty} from "@nestjs/swagger";

export class LoginRequestDto {
    @ApiProperty({
        description: "이메일",
        example: "test@hambabwa.kr",
    })
    readonly email: string;

    @ApiProperty({
        description: "password",
        example: "123",
    })
    readonly password: string;
}