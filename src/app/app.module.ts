import { AuthGuard } from '@infrastructure/middlewares/auth.middleware';
import { HttpExceptionFilter } from '@infrastructure/middlewares/error.middleware';
import { AuthModule } from '@infrastructure/modules/auth/auth.module';
import { DeliveryModule } from '@infrastructure/modules/delivery/delivery.module';
import { DishesModule } from '@infrastructure/modules/dishes/dishes.module';
import { OrdersModule } from '@infrastructure/modules/orders/orders.module';
import { RestaurantModule } from '@infrastructure/modules/restaurant/restaurant.module';
import { UserModule } from '@infrastructure/modules/user/user.module';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RestaurantModule,
    DishesModule,
    OrdersModule,
    DeliveryModule,
    EventEmitterModule.forRoot({
      wildcard: false, // restricts events to exact names only, you must specify the full event name.
      delimiter: '.', // use to separate event name (e.g user.created)
      newListener: true, // emit newListener event every time a new listener is added.
      removeListener: true, // emit removeListener event every time a listener is removed.
      maxListeners: 10, // maximum number of listeners can be register in an event
      verboseMemoryLeak: true, // shows memory leak warning message when the maxListeners limit is exceeded.
      ignoreErrors: false, // shows error every time error emitted in EventEmitter and terminates the Nestjs Process
    }),
  ],
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
