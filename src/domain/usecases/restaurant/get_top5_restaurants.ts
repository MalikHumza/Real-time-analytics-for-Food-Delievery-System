import { HttpResponse } from '@data/res/http_response';
import { DishesService } from '@data/services/dishes/dishes.service';
import { OrdersService } from '@data/services/orders/orders.service';
import { RestaurantService } from '@data/services/restaurant/restaurant.service';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import groupBy from 'lodash.groupby';
@Injectable()
export class GetTop5RestaurantsUseCase {
  @Inject()
  private restaurantService: RestaurantService;
  @Inject()
  private orderService: OrdersService;
  @Inject()
  private disheService: DishesService;

  public async call(restaurant_id: string) {
    const restaurant =
      await this.restaurantService.getRestaurantById(restaurant_id);
    if (!restaurant) {
      throw new HttpException('Restaurant does not exist', 400);
    }

    const orders =
      await this.orderService.getAllCompletedOrdersByRestaurantId(
        restaurant_id,
      );
    if (orders.length === 0) {
      throw new HttpException('No Order Completed Yet', 400);
    }

    const orderDisehs = await this.orderService.getDishIdsAndQuantityByOrderId(
      orders.map((i) => i.id),
    );
    const groupDishes = groupBy(orderDisehs, 'dish_id');

    const sumOfDishQuantity = Object.entries(groupDishes).reduce(
      (acc, [dish_id, dishes]) => {
        const total_quantity = (dishes as Array<{ quantity: number }>).reduce(
          (sum, dish) => sum + dish.quantity,
          0,
        );

        acc[dish_id] = total_quantity;
        return acc;
      },
      {} as Record<string, number>,
    );

    const getDishDetails = await this.disheService.getDishDetailsByDishIds(
      Object.entries(sumOfDishQuantity).map((i) => i[0]),
    );
    const dishSales = getDishDetails.map((i) => {
      const quantity = sumOfDishQuantity[i.id] || 0;
      const sales = quantity * i.price;

      return {
        dish_id: i.id,
        dish_name: i.name,
        dish_category: i.category,
        quantity,
        price: i.price,
        sales,
        popularity_score: i.popularity_score,
      };
    });

    const topDishes = dishSales
      .sort((a, b) => {
        // First, sort by popularity score in descending order
        if (b.popularity_score !== a.popularity_score) {
          return b.popularity_score - a.popularity_score;
        }
        // If popularity scores are equal, sort by sales in descending order
        return b.sales - a.sales;
      })
      .slice(0, 5); // Take the top 5

    return new HttpResponse(topDishes, false);
  }
}
