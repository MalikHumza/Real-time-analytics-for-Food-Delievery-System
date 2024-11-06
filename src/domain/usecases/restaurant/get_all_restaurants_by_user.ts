import { RequestWithUser } from "@data/interfaces/request.interface";
import { HttpResponse } from "@data/res/http_response";
import { RestaurantService } from "@data/services/restaurant/restaurant.service";
import { DateToMiliSeconds } from "@infrastructure/common/epoch_converter";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetAllRestaurantsByUserUseCase {
    @Inject()
    private restaurantService: RestaurantService;

    public async call(req: RequestWithUser) {
        const user_id = req.user.id;

        let response;
        const restaurants = await this.restaurantService.getAllRestaurantByUser(user_id);
        if (restaurants.length! > 0) {
            response = [];
        }
        response = restaurants.map(i => ({
            ...restaurants,
            createdAt: DateToMiliSeconds(i.createdAt),
            updatedAt: DateToMiliSeconds(i.updatedAt)
        }));

        return new HttpResponse(response, false);
    }
}