import { CreateRestaurantDTO } from '@data/dtos/restaurant/create_restaurant.dto';
import { RequestWithUser } from '@data/interfaces/request.interface';
import { HttpResponse } from '@data/res/http_response';
import { RestaurantService } from '@data/services/restaurant/restaurant.service';
import { DateToMiliSeconds } from '@infrastructure/common/epoch_converter';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateRestaurantUseCase {
  @Inject()
  private restaurantService: RestaurantService;

  public async call(req: RequestWithUser, data: CreateRestaurantDTO) {
    const user_id = req.user.id;

    const restaurant = await this.restaurantService.createRestaurant(
      user_id,
      data,
    );

    const response = {
      ...restaurant,
      createdAt: DateToMiliSeconds(restaurant.createdAt),
      updatedAt: DateToMiliSeconds(restaurant.updatedAt),
    };
    return new HttpResponse(response, false);
  }
}
