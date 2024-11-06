import database from '@config/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    private users = database.instance.user;

    findUser(email: string) {
        return this.users.findUnique({
            where: {
                email
            }
        })
    }
}
