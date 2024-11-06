import { UserService } from '@data/services/user/user.service';
import { Module } from '@nestjs/common';

@Module({
    providers: [UserService],
})
export class UserModule {

}
