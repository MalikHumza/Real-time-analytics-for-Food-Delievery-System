import { ESTIMATED_DELIVERY_TIME } from '@config/environment';
import { CreateOrdersDTO } from '@data/dtos/orders/create_order.dto';
import { RequestWithUser } from '@data/interfaces/request.interface';
import { HttpResponse } from '@data/res/http_response';
import { OrdersService } from '@data/services/orders/orders.service';
import { RestaurantService } from '@data/services/restaurant/restaurant.service';
import { DateToMiliSeconds } from '@infrastructure/common/epoch_converter';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ORDER_STATUS } from '@prisma/client';

@Injectable()
export class CreateOrdersUseCase {
  @Inject()
  private orderService: OrdersService;
  @Inject()
  private restaurantService: RestaurantService;
  @Inject()
  private eventsEmitter: EventEmitter2;

  public async call(
    req: RequestWithUser,
    restaurant_id: string,
    data: CreateOrdersDTO,
  ) {
    const user_id = req.user.id;
    const restaurant =
      await this.restaurantService.getRestaurantById(restaurant_id);
    if (!restaurant) {
      throw new HttpException('Retaurant not found', 400);
    }
    const date = new Date();
    const current_time = DateToMiliSeconds(date);

    const create_order = await this.orderService.createOrder({
      order_time: current_time,
      user_id,
      restaurant_id,
      status: ORDER_STATUS.PENDING,
      dishes: data.dishes.map((dish) => ({
        dish_id: dish.dish_id,
        quantity: dish.quantity,
      })),
    });

    this.eventsEmitter.emit('order.created', {
      order_id: create_order.id,
      dishes: data.dishes,
    });

    this.eventsEmitter.emit('order.placed', {
      user_id,
      order_id: create_order.id,
      restaurant_id,
      status: ORDER_STATUS.PENDING,
      estimated_delivery_time: `${ESTIMATED_DELIVERY_TIME} minutes`
    })

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const order = await this.orderService.getOrderById(create_order.id);
    if (!order) {
      throw new HttpException('Order not found', 400);
    }
    const response = {
      ...order,
      createdAt: DateToMiliSeconds(order.createdAt),
      updatedAt: DateToMiliSeconds(order.updatedAt),
    };

    return new HttpResponse(response, false);
  }
}
