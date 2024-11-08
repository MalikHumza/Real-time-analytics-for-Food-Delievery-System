import { ESTIMATED_DELIVERY_TIME } from '@config/environment';
import { RequestWithUser } from '@data/interfaces/request.interface';
import { HttpResponse } from '@data/res/http_response';
import { DeliveryService } from '@data/services/delivery/delivery.service';
import { OrdersService } from '@data/services/orders/orders.service';
import { DateToMiliSeconds } from '@infrastructure/common/epoch_converter';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ORDER_STATUS } from '@prisma/client';

@Injectable()
export class DeliverOrderUseCase {
  @Inject()
  private orderService: OrdersService;
  @Inject()
  private deliveryService: DeliveryService;
  @Inject()
  private eventEmitter: EventEmitter2;

  public async call(req: RequestWithUser, order_id: string) {
    const user_id = req.user.id;

    const order = await this.orderService.getOrderById(order_id);
    if (!order) {
      throw new HttpException('Order does not exist', 400);
    }
    if (order && order.status === ORDER_STATUS.COMPLETED) {
      throw new HttpException('Order already Delivered', 400);
    }

    const date = new Date();
    const current_time = DateToMiliSeconds(date);
    const get_delivery = await this.deliveryService.getDeliveryByOrder(
      user_id,
      order_id,
    );
    const update_delivery = await this.deliveryService.updateDeliveryTime(
      user_id,
      get_delivery.id,
      order_id,
      current_time,
    );

    await this.orderService.updateOrderStatus(
      order.user_id,
      update_delivery.order_id,
      order.restaurant_id,
      ORDER_STATUS.COMPLETED,
    );

    const order_status = await this.orderService.getOrderStatusById(order_id);
    const delivery_detail = await this.deliveryService.getDeliveryByOrder(
      user_id,
      order_id,
    );

    this.eventEmitter.emit('order.status', {
      user_id: order.user_id,
      order_id,
      restaurant_id: order.restaurant_id,
      status: order_status.status,
      rider_id: user_id,
      estimated_delivery_time: `${ESTIMATED_DELIVERY_TIME} minutes`,
      delivered_time: delivery_detail.delivery_time,
    });

    const response = {
      ...update_delivery,
      createdAt: DateToMiliSeconds(update_delivery.createdAt),
      updatedAt: DateToMiliSeconds(update_delivery.updatedAt),
    };

    return new HttpResponse(response, false);
  }
}
