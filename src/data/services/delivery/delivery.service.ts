import database from "@config/database";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeliveryService {
    private delivery = database.instance.deliveries;

    createOrderDelivery(user_id: string, order_id: string, estimated_time: number) {
        return this.delivery.create({
            data: {
                estimated_delivery_duration: estimated_time,
                assigned_rider_id: user_id,
                order_id: order_id
            },
        })
    }

    getDeliveryById(user_id: string, id: string) {
        return this.delivery.findUnique({
            where: {
                id,
                assigned_rider_id: user_id
            },
            include: {
                orders: true
            }
        });
    }

    getAllDeliveries(user_id: string) {
        return this.delivery.findMany({
            where: {
                assigned_rider_id: user_id
            },
            include: {
                orders: true
            }
        })
    }

    getDeliveryByOrder(user_id: string, order_id: string) {
        return this.delivery.findFirst({
            where: {
                assigned_rider_id: user_id,
                order_id
            }
        })
    }

    updateDeliveryTime(user_id: string, id: string, order_id: string, delivery_time: number) {
        return this.delivery.update({
            where: {
                assigned_rider_id: user_id,
                id,
                order_id
            },
            data: {
                delivery_time
            }
        })
    }
}