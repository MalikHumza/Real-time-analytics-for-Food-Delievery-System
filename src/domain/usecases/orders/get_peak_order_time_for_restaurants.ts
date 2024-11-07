import { HttpResponse } from '@data/res/http_response';
import { OrdersService } from '@data/services/orders/orders.service';
import { RestaurantService } from '@data/services/restaurant/restaurant.service';
import { Inject, Injectable } from '@nestjs/common';
import { format } from 'date-fns';

@Injectable()
export class GetPeakOrderTimeForEachRestaurantUseCase {
  @Inject()
  private orderService: OrdersService;
  @Inject()
  private restaurantService: RestaurantService;

  public async call() {
    const restaurants = await this.restaurantService.getAllRestaurants();
    if (restaurants.length === 0) {
      return new HttpResponse('No Restaurant found', false);
    }

    const peakOrderingTimes = [];
    for (let index = 0; index < restaurants.length; index++) {
      const item = restaurants[index];
      const ordersList = await this.orderService.getAllOrdersByRestaurantId(
        item.id,
      );
      if (ordersList.length === 0) {
        continue;
      }

      // group orders by hour
      const hourlyOrderCount = ordersList.reduce(
        (acc, order) => {
          const hourKey = format(order.createdAt, 'hh:00 a');
          if (!acc[hourKey]) {
            acc[hourKey] = 0;
          }
          acc[hourKey]++;
          return acc;
        },
        {} as Record<string, number>,
      );

      // find the peak hour with the maximum orders
      const peakTime = Object.entries(hourlyOrderCount).reduce(
        (max, [hour, count]) => {
          return count > max.orderCount ? { hour, orderCount: count } : max;
        },
        { hour: '', orderCount: 0 },
      );

      peakOrderingTimes.push({
        restaurant_id: item.id,
        restaurant_name: item.name,
        restaurant_location: item.location,
        peak_hour: peakTime.hour,
        order_counts: peakTime.orderCount,
      });
    }
    return new HttpResponse(peakOrderingTimes, false);
  }
}
