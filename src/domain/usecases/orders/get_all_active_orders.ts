import { RequestWithUser } from '@data/interfaces/request.interface';
import { HttpResponse } from '@data/res/http_response';
import { OrdersService } from '@data/services/orders/orders.service';
import { RestaurantService } from '@data/services/restaurant/restaurant.service';
import { MiliSecondsToDate } from '@infrastructure/common/epoch_converter';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetAllActiveOrdersUseCase {
  @Inject()
  private restaurantService: RestaurantService;
  @Inject()
  private orderService: OrdersService;

  public async call(req: RequestWithUser) {
    const user_id = req.user.id;
    const restaurants =
      await this.restaurantService.getAllRestaurantByUser(user_id);

    const thresholdTime = 30 * 60 * 1000;
    let response = [];
    const ordersList =
      await this.orderService.getAllActiveOrdersByRestaurantIds(
        restaurants.map((i) => i.id),
      );
    if (ordersList.length === 0) {
      return new HttpResponse(response, false);
    }

    for (let index = 0; index < restaurants.length; index++) {
      const item = restaurants[index];

      const restaurantOrders = {
        restaurant_id: item.id,
        restaurant_name: item.name,
        restaurant_location: item.location,
        active_orders: [],
      };

      ordersList.forEach((order) => {
        if (order.restaurant.id === item.id) {
          const orderAge = Date.now() - order.createdAt.getTime();
          if (orderAge > thresholdTime) {
            restaurantOrders.active_orders.push({
              order_id: order.id,
              status: order.status,
              order_time: MiliSecondsToDate(order.order_time),
            });
          }
        }
      });

      if (restaurantOrders.active_orders.length > 0) {
        response.push(restaurantOrders);
      }
    }

    return new HttpResponse(response, false);
  }
}
