import { CreateOrdersDTO } from "@data/dtos/orders/create_order.dto";
import { RequestWithUser } from "@data/interfaces/request.interface";
import { HttpResponse } from "@data/res/http_response";
import { OrdersService } from "@data/services/orders/orders.service";
import { RestaurantService } from "@data/services/restaurant/restaurant.service";
import { DateToMiliSeconds } from "@infrastructure/common/epoch_converter";
import { HttpException, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateOrdersUseCase {
    @Inject()
    private orderService: OrdersService;
    @Inject()
    private restaurantService: RestaurantService;

    public async call(req: RequestWithUser, restaurant_id: string, data: CreateOrdersDTO) {
        const user_id = req.user.id;
        const restaurant = await this.restaurantService.getRestaurantById(restaurant_id);
        if (!restaurant) {
            throw new HttpException('Retaurant not found', 400);
        }
        const date = new Date();
        const current_time = DateToMiliSeconds(date);

        const create_order = await this.orderService.createOrder({ order_time: current_time, user_id, restaurant_id, dishes: data.dishes.map(dish => ({ dish_id: dish.dish_id, quantity: dish.quantity })) })
        const response = {
            ...create_order,
            createdAt: DateToMiliSeconds(create_order.createdAt),
            updatedAt: DateToMiliSeconds(create_order.updatedAt)
        };

        return new HttpResponse(response, false);
    }
}