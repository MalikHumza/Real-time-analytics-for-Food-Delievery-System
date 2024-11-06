import { OrdersService } from '@data/services/orders/orders.service';
import { RestaurantService } from '@data/services/restaurant/restaurant.service';
import { CreateOrdersUseCase } from '@domain/usecases/orders/create_orders';
import { GetOrdersByUserUseCase } from '@domain/usecases/orders/get_orders_by_user';
import { OrdersController } from '@infrastructure/controllers/orders/orders.controller';
import { RolesGuard } from '@infrastructure/middlewares/roles.middleware';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
    providers: [OrdersService, CreateOrdersUseCase, RestaurantService, GetOrdersByUserUseCase, { provide: APP_GUARD, useClass: RolesGuard },],
    controllers: [OrdersController],
    imports: []
})
export class OrdersModule { }
