import { producer } from '@config/kafka/kafka.config';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ORDER_STATUS } from '@prisma/client';

@Injectable()
export class KafkaOrderPlaceEventListner {
  @OnEvent('order.placed')
  async publicOrderEvent(
    order_id: string,
    restaurant_id: string,
    status: ORDER_STATUS,
    user_id: string,
    estimated_delivery_time: string,
  ) {
    const message = {
      user_id,
      order_id,
      restaurant_id,
      status,
      estimated_delivery_time,
      timeStamp: new Date().toISOString(),
    };

    await producer.send({
      topic: 'order-placed',
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
  }
}
