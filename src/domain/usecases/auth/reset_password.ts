import { ResetPasswordDTO } from "@data/dtos/auth/reset_password.dto";
import { RequestWithUser } from "@data/interfaces/request.interface";
import { HttpResponse } from "@data/res/http_response";
import { AuthService } from "@data/services/auth/auth.service";
import { UserService } from "@data/services/user/user.service";
import { HttpException, Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class ResetPasswordUseCase {
    @Inject()
    private authService: AuthService;
    @Inject()
    private userService: UserService;

    public async call(req: RequestWithUser, data: ResetPasswordDTO) {
        const user_id = req.user.id;
        const user = await this.userService.findUser(data.email);
        if (!user) {
            throw new HttpException("Invalid User", 400);
        }
        const isPassowrdValid = await bcrypt.compare(
            data.old_password,
            user.password,
        );
        if (!isPassowrdValid) {
            throw new HttpException("Old password do not match", 400);
        }
        const hashedPassword = await bcrypt.hash(data.current_password, 10);

        await this.authService.resetPassword({
            email: data.email,
            passowrd: hashedPassword,
            user_id: user_id,
        });
        return new HttpResponse(true);
    }
}