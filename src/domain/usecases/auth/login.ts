import { LoginDTO } from "@data/dtos/auth/login.dto";
import { HttpResponse } from "@data/res/http_response";
import { AuthService } from "@data/services/auth/auth.service";
import { UserService } from "@data/services/user/user.service";
import { HttpException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
    @Inject()
    private authService: AuthService;
    @Inject()
    private userService: UserService;
    @Inject()
    private jwtService: JwtService;

    public async call(data: LoginDTO) {
        const user = await this.userService.findUser(data.email);
        if (!user) {
            throw new HttpException("User not found", 400);
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid Password");
        }

        let response;

        const sessionToken = await this.jwtService.signAsync({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });

        const isSession = await this.authService.findTokenByUserId(user.id);
        if (!isSession) {
            const session = await this.authService.loginUser(sessionToken, user.id);
            response = {
                token: session.sessionToken,
            };

            return new HttpResponse(response, false);
        }

        const sessionUpdate = await this.authService.updateUserSession(
            isSession.id,
            sessionToken,
        );

        response = {
            token: sessionUpdate.sessionToken
        };

        return new HttpResponse(response, false);

    }
}