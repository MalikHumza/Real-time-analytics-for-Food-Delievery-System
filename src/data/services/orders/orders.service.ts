import database from '@config/database';
import { Injectable } from '@nestjs/common';
import { ORDER_STATUS } from '@prisma/client';

@Injectable()
export class OrdersService {
  private orders = database.instance.orders;

  createOrder(data: {
    total_cost: number;
    order_time: number;
    status: ORDER_STATUS;
    user_id: string;
    restaurant_id: string;
  }) {
    return this.orders.create({
      data: {
        order_time: data.order_time,
        status: data.status,
        total_cost: data.total_cost,
        user_id: data.user_id,
        restaurant_id: data.restaurant_id,
      },
    });
  }
}
