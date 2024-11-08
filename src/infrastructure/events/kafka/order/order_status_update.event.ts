import { producer } from "@config/kafka/kafka.config";
import { MiliSecondsToDate } from "@infrastructure/common/epoch_converter";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { ORDER_STATUS } from "@prisma/client";

@Injectable()
export class KafkaOrderStatusUpdateEventListener {

    @OnEvent('order.status')
    async orderStatusUpdate(user_id: string, order_id: string, restaurant_id: string, status: ORDER_STATUS, rider_id: string, estimated_delivery_time: string, delivered_time?: number) {

        const message = {
            user_id,
            order_id,
            restaurant_id,
            status,
            rider_id,
            estimated_delivery_time,
            delivered_time: MiliSecondsToDate(delivered_time) ?? null,
            timestamp: new Date().toISOString()
        };

        await producer.send({
            topic: 'order-placed',
            messages: [
                {
                    value: JSON.stringify(message)
                }
            ]
        })
    }
}