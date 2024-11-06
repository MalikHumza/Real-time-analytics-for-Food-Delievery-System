import { CreateDishesDTO } from '@data/dtos/dishes/create_dishes.dto';
import { HttpResponse } from '@data/res/http_response';
import { DishesService } from '@data/services/dishes/dishes.service';
import { RestaurantService } from '@data/services/restaurant/restaurant.service';
import { DateToMiliSeconds } from '@infrastructure/common/epoch_converter';
import { HttpException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateDishUseCase {
  @Inject()
  private dishService: DishesService;
  @Inject()
  private restaurantService: RestaurantService;

  public async call(restaurant_id: string, data: CreateDishesDTO) {
    const restaurant =
      await this.restaurantService.getRestaurantById(restaurant_id);
    if (!restaurant) {
      throw new HttpException('Restaurant not found', 400);
    }

    const dishes = await this.dishService.createDishes(restaurant_id, data);
    const response = {
      ...dishes,
      createdAt: DateToMiliSeconds(dishes.createdAt),
      updatedAt: DateToMiliSeconds(dishes.updatedAt),
    };

    return new HttpResponse(response, false);
  }
}
