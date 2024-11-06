import { HttpResponse } from "@data/res/http_response";
import { RestaurantService } from "@data/services/restaurant/restaurant.service";
import { DateToMiliSeconds } from "@infrastructure/common/epoch_converter";
import { HttpException, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetRestaurantByIdUseCase {
    @Inject()
    private restaurantService: RestaurantService;

    public async call(id: string) {
        const restaurant = await this.restaurantService.getRestaurantById(id);
        if (!restaurant) {
            throw new HttpException('Restaurant not found', 400)
        }
        const response = {
            ...restaurant,
            createdAt: DateToMiliSeconds(restaurant.createdAt),
            updatedAt: DateToMiliSeconds(restaurant.updatedAt),
        };

        return new HttpResponse(response, false);
    }
}