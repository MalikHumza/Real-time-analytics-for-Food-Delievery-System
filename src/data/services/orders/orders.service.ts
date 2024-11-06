import database from '@config/database';
import { Injectable } from '@nestjs/common';
import { ORDER_STATUS } from '@prisma/client';

@Injectable()
export class OrdersService {
  private orders = database.instance.orders;

  createOrder(data: {
    order_time: number;
    user_id: string;
    restaurant_id: string;
    status: ORDER_STATUS,
    dishes: Array<{ dish_id: string; quantity: number }>;
  }) {
    return this.orders.create({
      data: {
        order_time: data.order_time,
        user_id: data.user_id,
        status: data.status,
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
        restaurant: true
      }
    })
  }

  getOrderStatusById(order_id: string) {
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

  updateOrderTotalCost(id: string, total_cost: number) {
    return this.orders.update({
      where: {
        id
      },
      data: {
        total_cost
      }
    })
  }

  updateOrderStatus(user_id: string, id: string, restaurant_id: string, status: ORDER_STATUS) {
    return this.orders.update({
      where: {
        user_id,
        id,
        restaurant_id,
      },
      data: {
        status
      }
    })
  }

  getOrdersByRestaurantAndOrderId(order_id: string, restaurant_id: string) {
    return this.orders.findMany({
      where: {
        restaurant_id,
        id: order_id,
        status: ORDER_STATUS.COMPLETED
      },
      include: {
        orderDish: true
      }
    });
  }

  getOrderDetailsByDishId(dish_ids: string[]) {
    return this.orders.groupBy({
      by: ['orderDish', 'dish_id'],
      orderBy: {
        orderDish: {
          every: {
            dis_id
          }
        }
      },
      where: {
        orderDish: {
          some: {
            dish_id: {
              in: dish_ids
            }
          }
        },
        status: ORDER_STATUS.COMPLETED,
      },
      _sum: {
        total_coast: true
      }
    });
  }
}
