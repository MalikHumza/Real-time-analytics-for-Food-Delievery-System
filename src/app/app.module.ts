import { AuthGuard } from '@infrastructure/middlewares/auth.middleware';
import { HttpExceptionFilter } from '@infrastructure/middlewares/error.middleware';
import { AuthModule } from '@infrastructure/modules/auth/auth.module';
import { DishesModule } from '@infrastructure/modules/dishes/dishes.module';
import { RestaurantModule } from '@infrastructure/modules/restaurant/restaurant.module';
import { UserModule } from '@infrastructure/modules/user/user.module';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

@Module({
  imports: [AuthModule, UserModule, RestaurantModule, DishesModule],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: AuthGuard },
    // {
    //     provide: APP_GUARD, useFactory: (authGuard: AuthGuard, roles_guard: RolesGuard) => {
    //         return [authGuard, roles_guard]
    //     },
    //     inject: [AuthGuard, RolesGuard]
    // },
  ],
})
export class AppModule {}
