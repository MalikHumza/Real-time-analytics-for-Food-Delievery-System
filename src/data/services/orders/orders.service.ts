import database from '@config/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  private orders = database.instance.orders;

  createOrder(data: {
    order_time: number;
    user_id: string;
    restaurant_id: string;
    dishes: Array<{ dish_id: string; quantity: number }>;
  }) {
    return this.orders.create({
      data: {
        order_time: data.order_time,
        user_id: data.user_id,
        restaurant_id: data.restaurant_id,
        orderDish: {
          create: data.dishes.map(i => ({
            dish_id: i.dish_id,
            quantity: i.quantity,
          })),
        }
      },
    });
  }

  getOrderById(order_id: string) {
    return this.orders.findUnique({
      where: {
        id: order_id
      },
      include: {
        orderDish: true,
        Delieveries: true,
        restaurant: true
      }
    })
  }

  getOrderByUser(user_id: string) {
    return this.orders.findMany({
      where: {
        user_id
      },
      include: {
        orderDish: true,
        Delieveries: true,
        restaurant: true
      }
    })
  }
}
