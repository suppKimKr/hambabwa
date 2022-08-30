import {BeforeInsert, Column, Entity} from "typeorm";
import {AutoIncrementIdEntity} from "../../database/auto-increment-id-entity";
import {Exclude} from "class-transformer";
import {UserRole} from "../enums/user.role.enum";
import * as bcrypt from "bcryptjs";
import {OmitType} from "@nestjs/swagger";

@Entity('TB_USER')
export class User extends AutoIncrementIdEntity {
    @Column({ unique: true, type: "varchar", length: 50 })
    public email: string;

    @Column({ type: "varchar", length: 20 })
    public nickname: string;

    @Column({ type: "varchar", length: 80 })
    @Exclude()
    public password: string;

    @Column({ nullable: true })
    @Exclude()
    currentHashedRefreshToken?: string;

    @Column({ type: "enum", enum: UserRole })
    public role: UserRole;

    @Column({
        default: 'https://image.hambabwa.kr/dev/profile/default.png',
    })
    public imageUrl: string;

    @BeforeInsert()
    @Exclude()
    hashPassword = async() => {
        this.password = await bcrypt.hashSync(this.password, 10);
    }

    @Exclude()
    getCurrentRefreshToken = async(refreshToken: string) => {
        return await bcrypt.hash(refreshToken, 10);
    }
}

export class ReadOnlyUserData extends OmitType(User, ["password"] as const) {}
