import { AuthService } from '@data/services/auth/auth.service';
import { AuthController } from '@infrastructure/controllers/auth/auth.controller';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_KEY } from '@config/environment';
import { LoginUseCase } from '@domain/usecases/auth/login';
import { SignUpUseCase } from '@domain/usecases/auth/signup';
import { UserService } from '@data/services/user/user.service';
import { ResetPasswordUseCase } from '@domain/usecases/auth/reset_password';
import { SignOutUseCase } from '@domain/usecases/auth/signout';

@Module({
  providers: [
    AuthService,
    LoginUseCase,
    SignUpUseCase,
    UserService,
    ResetPasswordUseCase,
    SignOutUseCase,
  ],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: JWT_KEY,
      signOptions: { expiresIn: '86400s' },
    }),
  ],
  exports: [LoginUseCase, SignUpUseCase],
  controllers: [AuthController],
})
export class AuthModule {}
