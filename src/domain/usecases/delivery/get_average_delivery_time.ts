import { HttpResponse } from '@data/res/http_response';
import { OrdersService } from '@data/services/orders/orders.service';
import { RestaurantService } from '@data/services/restaurant/restaurant.service';
import { formatEpochTime } from '@infrastructure/common/epoch_converter';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { format } from 'date-fns';

@Injectable()
export class GetAverageDeliveryTimeForCompletedOrderUseCase {
  @Inject()
  private restaurantService: RestaurantService;
  @Inject()
  private orderService: OrdersService;

  public async call(restaurant_id: string, period: string) {
    const restaurant =
      await this.restaurantService.getRestaurantById(restaurant_id);
    if (!restaurant) {
      throw new HttpException('Restaurant not found', 400);
    }
    let response;
    const ordersList =
      await this.orderService.getAllCompletedOrdersByRestaurantId(
        restaurant_id,
      );
    if (ordersList.length === 0) {
      response = [];
    }
    //calculate delivery Time for each order
    const deliveryTimes = ordersList.map((i) => ({
      createdAt: i.createdAt,
      deliveryTime: i.updatedAt.getTime() - i.createdAt.getTime(),
    }));

    //group and calculate averages based on the period
    const groupData = this.groupByPeriod(deliveryTimes, period);

    //calculate average delivery time for each group
    const averageTime = Object.entries(groupData).map(([key, times]) => {
      const totalDeliveryTime = times.reduce((sum, time) => sum + time, 0);
      const averageDeliveryTime = totalDeliveryTime / times.length;
      return { period: key, averageDeliveryTime };
    });
    response = averageTime.map((i) => ({
      ...i,
      averageDeliveryTime: formatEpochTime(i.averageDeliveryTime),
    }));
    return new HttpResponse(response, false);
  }

  private groupByPeriod(
    deliveryTimes: Array<{ createdAt: Date; deliveryTime: number }>,
    period: string,
  ) {
    return deliveryTimes.reduce(
      (acc, order) => {
        const dateKey =
          period === 'daily'
            ? format(order.createdAt, 'yyyy-MM-dd') // Group by day
            : format(order.createdAt, 'yyyy-MM-ww'); // Group by week

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(order.deliveryTime);
        return acc;
      },
      {} as Record<string, number[]>,
    );
  }
}
