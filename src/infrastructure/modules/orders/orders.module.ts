import { DishesService } from '@data/services/dishes/dishes.service';
import { OrdersService } from '@data/services/orders/orders.service';
import { RestaurantService } from '@data/services/restaurant/restaurant.service';
import { GetOrderCompletedByUserUseCase } from '@domain/usecases/orders/completed_order_by_user';
import { CreateOrdersUseCase } from '@domain/usecases/orders/create_orders';
import { GetAllActiveOrdersUseCase } from '@domain/usecases/orders/get_all_active_orders';
import { GetAllPendingOrdersUseCase } from '@domain/usecases/orders/get_all_pending_orders';
import { GetOrdersByUserUseCase } from '@domain/usecases/orders/get_orders_by_user';
import { GetPeakOrderTimeForEachRestaurantUseCase } from '@domain/usecases/orders/get_peak_order_time_for_restaurants';
import { GetInProgressOrdersByUserUseCase } from '@domain/usecases/orders/inProgress_orders_by_user';
import { OrdersController } from '@infrastructure/controllers/orders/orders.controller';
import { KafkaOrderPlaceEventListner } from '@infrastructure/events/kafka/order/order_placed.events';
import { OrderCreatedListener } from '@infrastructure/events/orders/order_create.event';
import { RolesGuard } from '@infrastructure/middlewares/roles.middleware';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    OrdersService,
    CreateOrdersUseCase,
    RestaurantService,
    GetOrdersByUserUseCase,
    OrderCreatedListener,
    GetOrderCompletedByUserUseCase,
    GetInProgressOrdersByUserUseCase,
    GetAllPendingOrdersUseCase,
    GetPeakOrderTimeForEachRestaurantUseCase,
    DishesService,
    GetAllActiveOrdersUseCase,
    KafkaOrderPlaceEventListner,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  controllers: [OrdersController],
  imports: [],
  exports: [],
})
export class OrdersModule {}
