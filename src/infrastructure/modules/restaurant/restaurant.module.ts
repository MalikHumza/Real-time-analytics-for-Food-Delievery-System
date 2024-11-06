import { RestaurantService } from '@data/services/restaurant/restaurant.service';
import { CreateRestaurantUseCase } from '@domain/usecases/restaurant/create_restaurant';
import { GetRestaurantByIdUseCase } from '@domain/usecases/restaurant/get_restaurant_by_id';
import { RestaurantController } from '@infrastructure/controllers/restaurant/restaurant.controller';
import { RolesGuard } from '@infrastructure/middlewares/roles.middleware';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
    providers: [CreateRestaurantUseCase, RestaurantService, GetRestaurantByIdUseCase, { provide: APP_GUARD, useClass: RolesGuard }],
    imports: [],
    exports: [RestaurantService],
    controllers: [RestaurantController]
})
export class RestaurantModule { }
