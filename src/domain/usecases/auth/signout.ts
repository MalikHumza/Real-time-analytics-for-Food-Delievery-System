import { RequestWithUser } from '@data/interfaces/request.interface';
import { HttpResponse } from '@data/res/http_response';
import { AuthService } from '@data/services/auth/auth.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SignOutUseCase {
  @Inject()
  private authService: AuthService;

  public async call(req: RequestWithUser) {
    const header = req.header('Authorization');
    const sessionToken = header.split('Bearer ')[1];

    await this.authService.signOutUser(sessionToken);

    return new HttpResponse(true);
  }
}
