import { SignUpDTO } from '@data/dtos/auth/signIn.dto';
import { HttpResponse } from '@data/res/http_response';
import { AuthService } from '@data/services/auth/auth.service';
import { UserService } from '@data/services/user/user.service';
import { DateToMiliSeconds } from '@infrastructure/common/epoch_converter';
import { HttpException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SignUpUseCase {
  @Inject()
  private authService: AuthService;
  @Inject()
  private userService: UserService;

  public async call(data: SignUpDTO) {
    const user = await this.userService.findUser(data.email);
    if (!user) {
      const createUser = await this.authService.singUp(data);
      const response = {
        ...createUser,
        createdAt: DateToMiliSeconds(createUser.createdAt),
        updatedAt: DateToMiliSeconds(createUser.updatedAt),
      };
      return new HttpResponse(response, false);
    }
    throw new HttpException('User with this email already exist!', 400);
  }
}
