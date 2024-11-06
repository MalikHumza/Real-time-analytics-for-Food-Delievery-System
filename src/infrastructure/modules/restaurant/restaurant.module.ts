import { DishesService } from '@data/services/dishes/dishes.service';
import { OrdersService } from '@data/services/orders/orders.service';
import { RestaurantService } from '@data/services/restaurant/restaurant.service';
import { CreateRestaurantUseCase } from '@domain/usecases/restaurant/create_restaurant';
import { GetAllRestaurantsUseCase } from '@domain/usecases/restaurant/get_all_restaurants';
import { GetAllRestaurantsByUserUseCase } from '@domain/usecases/restaurant/get_all_restaurants_by_user';
import { GetRestaurantByIdUseCase } from '@domain/usecases/restaurant/get_restaurant_by_id';
import { GetTop5RestaurantsUseCase } from '@domain/usecases/restaurant/get_top5_restaurants';
import { RestaurantController } from '@infrastructure/controllers/restaurant/restaurant.controller';
import { RolesGuard } from '@infrastructure/middlewares/roles.middleware';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    CreateRestaurantUseCase,
    RestaurantService,
    GetRestaurantByIdUseCase,
    GetAllRestaurantsUseCase,
    GetAllRestaurantsByUserUseCase,
    GetTop5RestaurantsUseCase,
    OrdersService,
    DishesService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  imports: [],
  exports: [RestaurantService],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
