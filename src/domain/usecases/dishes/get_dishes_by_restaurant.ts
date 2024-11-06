import { HttpResponse } from "@data/res/http_response";
import { DishesService } from "@data/services/dishes/dishes.service";
import { RestaurantService } from "@data/services/restaurant/restaurant.service";
import { DateToMiliSeconds } from "@infrastructure/common/epoch_converter";
import { HttpException, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetAllDishesByRestaurantUseCase {
    @Inject()
    private dishesService: DishesService;
    @Inject()
    private restaurantService: RestaurantService;

    public async call(restaurant_id: string) {
        const restaurant = await this.restaurantService.getRestaurantById(restaurant_id);
        if (!restaurant) {
            throw new HttpException('Restaurant not found', 400);
        }

        let response;
        const dishes = await this.dishesService.getDishesByRestaurant(restaurant_id);
        if (dishes.length! > 0) {
            response = [];
        }
        response = dishes.map(i => ({
            ...i,
            createdAt: DateToMiliSeconds(i.createdAt),
            updatedAt: DateToMiliSeconds(i.updatedAt)
        }));

        return new HttpResponse(response);
    }
}