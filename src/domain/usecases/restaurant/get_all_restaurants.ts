import { HttpResponse } from '@data/res/http_response';
import { RestaurantService } from '@data/services/restaurant/restaurant.service';
import { DateToMiliSeconds } from '@infrastructure/common/epoch_converter';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetAllRestaurantsUseCase {
  @Inject()
  private restaurantService: RestaurantService;

  public async call() {
    let response;
    const restaurants = await this.restaurantService.getAllRestaurants();
    if (restaurants.length! > 0) {
      response = [];
    }
    response = restaurants.map((i) => ({
      ...i,
      createdAt: DateToMiliSeconds(i.createdAt),
      updatedAt: DateToMiliSeconds(i.updatedAt),
    }));

    return new HttpResponse(response, false);
  }
}
