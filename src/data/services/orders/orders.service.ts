import database from '@config/database';
import { Injectable } from '@nestjs/common';
import { ORDER_STATUS } from '@prisma/client';

@Injectable()
export class OrdersService {
  private orders = database.instance.orders;
  private orderDish = database.instance.orderDish;

  createOrder(data: {
    order_time: number;
    user_id: string;
    restaurant_id: string;
    status: ORDER_STATUS;
    dishes: Array<{ dish_id: string; quantity: number }>;
  }) {
    return this.orders.create({
      data: {
        order_time: data.order_time,
        user_id: data.user_id,
        status: data.status,
        restaurant_id: data.restaurant_id,
        orderDish: {
          create: data.dishes.map((i) => ({
            dish_id: i.dish_id,
            quantity: i.quantity,
          })),
        },
      },
    });
  }

  getOrderById(order_id: string) {
    return this.orders.findUnique({
      where: {
        id: order_id,
      },
      include: {
        orderDish: true,
        restaurant: true,
      },
    });
  }

  getOrderStatusById(order_id: string) {
    return this.orders.findUnique({
      where: {
        id: order_id,
      },
      include: {
        orderDish: true,
        Delieveries: true,
        restaurant: true,
      },
    });
  }

  getOrderByUser(user_id: string) {
    return this.orders.findMany({
      where: {
        user_id,
      },
      include: {
        orderDish: true,
        Delieveries: true,
        restaurant: true,
      },
    });
  }

  updateOrderTotalCost(id: string, total_cost: number) {
    return this.orders.update({
      where: {
        id,
      },
      data: {
        total_cost,
      },
    });
  }

  updateOrderStatus(
    user_id: string,
    id: string,
    restaurant_id: string,
    status: ORDER_STATUS,
  ) {
    return this.orders.update({
      where: {
        user_id,
        id,
        restaurant_id,
      },
      data: {
        status,
      },
    });
  }

  getOrdersByRestaurantAndOrderId(order_id: string, restaurant_id: string) {
    return this.orders.findMany({
      where: {
        restaurant_id,
        id: order_id,
        status: ORDER_STATUS.COMPLETED,
      },
      include: {
        orderDish: true,
      },
    });
  }

  getOrderDetailsByDishId(dish_ids: string[]) {
    return this.orderDish.groupBy({
      by: ['order_id', 'dish_id'],
      orderBy: [
        { dish_id: 'desc' },
        { order_id: 'desc' },
      ],
      where: {
        order: {
          status: ORDER_STATUS.COMPLETED
        },
        dish_id: {
          in: dish_ids
        }
      },
    });
  }

  getOrdersByOrderId(order_ids: string[]) {
    return this.orders.findMany({
      where: {
        id: {
          in: order_ids
        }
      },
      include: {
        orderDish: true
      }
    })
  }

  getCompletedOrdersByRider(rider_id: string) {
    return this.orders.findMany({
      where: {
        status: ORDER_STATUS.COMPLETED,
        Delieveries: {
          some: {
            assigned_rider_id: rider_id
          }
        }
      },
    })
  }

  getAllOrdersByRestaurantId(restaurant_id: string) {
    return this.orders.findMany({
      where: {
        restaurant_id
      }
    })
  }

  getInProgressOrdersByRider(rider_id: string) {
    return this.orders.findMany({
      where: {
        status: ORDER_STATUS.IN_PROGRESS,
        Delieveries: {
          some: {
            assigned_rider_id: rider_id
          }
        }
      },
    })
  }

  getAllPendingOrders() {
    return this.orders.findMany({
      where: {
        status: ORDER_STATUS.PENDING,
      },
      include: {
        restaurant: true,
        orderDish: true
      }
    })
  }

  getAllCompletedOrdersByRestaurantId(restaurant_id: string) {
    return this.orders.findMany({
      where: {
        restaurant_id,
        status: ORDER_STATUS.COMPLETED
      }
    })
  }

  getDishIdsAndQuantityByOrderId(order_ids: string[]) {
    return this.orderDish.findMany({
      where: {
        order_id: {
          in: order_ids
        }
      }
    })
  }

  getAllActiveOrdersByRestaurantIds(restaurant_ids: string[]) {
    return this.orders.findMany({
      where: {
        restaurant_id: {
          in: restaurant_ids
        },
        status: {
          not: ORDER_STATUS.COMPLETED
        }
      },
      select: {
        restaurant: {
          select: {
            id: true,
            name: true,
            location: true
          }
        },
        id: true,
        status: true,
        order_time: true,
        createdAt: true,
      }
    })
  }
}
