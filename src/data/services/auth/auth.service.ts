import database from '@config/database';
import { SignUpDTO } from '@data/dtos/auth/signIn.dto';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private auth = database.instance.user;
  private session = database.instance.session;

  async singUp(data: SignUpDTO) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.auth.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        password: hashedPassword,
      },
    });
  }

  findTokenByUserId(user_id: string) {
    return this.session.findFirst({
      where: {
        user_id,
      },
    });
  }

  loginUser(session_token: string, user_id: string) {
    return this.session.create({
      data: {
        sessionToken: session_token,
        user_id,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }

  updateUserSession(id: string, session_token: string) {
    return this.session.update({
      where: {
        id,
      },
      data: {
        sessionToken: session_token,
      },
    });
  }

  resetPassword(data: { user_id: string; email: string; passowrd: string }) {
    return this.auth.update({
      where: {
        id: data.user_id,
        email: data.email,
      },
      data: {
        password: data.passowrd,
      },
    });
  }

  signOutUser(sessionToken: string) {
    return this.session.delete({
      where: {
        sessionToken,
      },
    });
  }
}
