import { DishesService } from '@data/services/dishes/dishes.service';
import { RestaurantService } from '@data/services/restaurant/restaurant.service';
import { CreateDishUseCase } from '@domain/usecases/dishes/create_dishes';
import { GetAllDishesByRestaurantUseCase } from '@domain/usecases/dishes/get_dishes_by_restaurant';
import { DishesController } from '@infrastructure/controllers/dishes/dishes.controller';
import { RolesGuard } from '@infrastructure/middlewares/roles.middleware';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    DishesService,
    CreateDishUseCase,
    RestaurantService,
    GetAllDishesByRestaurantUseCase,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  imports: [],
  controllers: [DishesController],
})
export class DishesModule { }
