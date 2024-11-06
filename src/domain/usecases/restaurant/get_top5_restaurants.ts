import { DishesService } from "@data/services/dishes/dishes.service";
import { OrdersService } from "@data/services/orders/orders.service";
import { RestaurantService } from "@data/services/restaurant/restaurant.service";
import { HttpException, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetTop5RestaurantsUseCase {
    @Inject()
    private restaurantService: RestaurantService;
    @Inject()
    private orderService: OrdersService;
    @Inject()
    private disheService: DishesService;

    public async call(restaurant_id: string) {
        const restaurant = await this.restaurantService.getRestaurantById(restaurant_id);
        if (!restaurant) {
            throw new HttpException('Restaurant does not exist', 400);
        }
        const dishes = await this.disheService.getDishesByRestaurant(restaurant_id);
        if (dishes.length === 0) {
            throw new HttpException('No dishes Available', 400)
        }
        const orderDetails = await this.orderService.getOrderDetailsByDishId(dishes.map(i => i.id))
        if (orderDetails.length === 0) {
            throw new HttpException('No Orders Yet', 400);
        }
    }
}