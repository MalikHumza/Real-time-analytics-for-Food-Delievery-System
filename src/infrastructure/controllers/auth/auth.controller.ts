import { LoginDTO } from '@data/dtos/auth/login.dto';
import { ResetPasswordDTO } from '@data/dtos/auth/reset_password.dto';
import { SignUpDTO } from '@data/dtos/auth/signIn.dto';
import { RequestWithUser } from '@data/interfaces/request.interface';
import { LoginUseCase } from '@domain/usecases/auth/login';
import { ResetPasswordUseCase } from '@domain/usecases/auth/reset_password';
import { SignOutUseCase } from '@domain/usecases/auth/signout';
import { SignUpUseCase } from '@domain/usecases/auth/signup';
import { Public } from '@infrastructure/decorators/public.decorator';
import { AuthGuard } from '@infrastructure/middlewares/auth.middleware';
import { Body, Controller, Delete, HttpCode, Patch, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly sinUpUseCase: SignUpUseCase,
        private readonly logInUseCase: LoginUseCase,
        private readonly resetPasswordUseCase: ResetPasswordUseCase,
        private readonly signOutUseCase: SignOutUseCase
    ) { }

    @Post('/singup')
    @Public()
    @UsePipes(new ValidationPipe())
    @HttpCode(201)
    singup(@Body() data: SignUpDTO) {
        return this.sinUpUseCase.call(data);
    }

    @Post('/login')
    @Public()
    @UsePipes(new ValidationPipe())
    @HttpCode(201)
    logIn(@Body() data: LoginDTO) {
        return this.logInUseCase.call(data);
    }


    @Patch('/reset-password')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    @HttpCode(201)
    resetPassword(@Req() req: RequestWithUser, @Body() data: ResetPasswordDTO) {
        return this.resetPasswordUseCase.call(req, data);
    }

    @Delete('/logout')
    @UseGuards(AuthGuard)
    @HttpCode(201)
    logOut(@Req() req: RequestWithUser) {
        return this.signOutUseCase.call(req);
    }


}
