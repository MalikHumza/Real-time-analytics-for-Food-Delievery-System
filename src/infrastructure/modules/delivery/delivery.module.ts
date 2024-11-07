import { DeliveryService } from '@data/services/delivery/delivery.service';
import { OrdersService } from '@data/services/orders/orders.service';
import { RestaurantService } from '@data/services/restaurant/restaurant.service';
import { AcceptOrderDeliveryUseCase } from '@domain/usecases/delivery/accept_order_delivery';
import { DeliverOrderUseCase } from '@domain/usecases/delivery/deliver_order';
import { GetAverageDeliveryTimeForCompletedOrderUseCase } from '@domain/usecases/delivery/get_average_delivery_time';
import { DeliveryController } from '@infrastructure/controllers/delivery/delivery.controller';
import { RolesGuard } from '@infrastructure/middlewares/roles.middleware';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    DeliveryService,
    AcceptOrderDeliveryUseCase,
    GetAverageDeliveryTimeForCompletedOrderUseCase,
    DeliverOrderUseCase,
    OrdersService,
    RestaurantService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  imports: [],
  exports: [DeliveryService],
  controllers: [DeliveryController],
})
export class DeliveryModule { }
