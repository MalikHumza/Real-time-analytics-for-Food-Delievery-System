import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDTO {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly old_password: string;

    @IsString()
    @IsNotEmpty()
    readonly current_password: string;
}
