import { ESTIMATED_DELIVERY_TIME } from "@config/environment";
import { RequestWithUser } from "@data/interfaces/request.interface";
import { HttpResponse } from "@data/res/http_response";
import { DeliveryService } from "@data/services/delivery/delivery.service";
import { OrdersService } from "@data/services/orders/orders.service";
import { DateToMiliSeconds } from "@infrastructure/common/epoch_converter";
import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ORDER_STATUS } from "@prisma/client";

@Injectable()
export class AcceptOrderDeliveryUseCase {
    @Inject()
    private orderService: OrdersService;
    @Inject()
    private deliveryService: DeliveryService;

    public async call(req: RequestWithUser, order_id: string) {
        const user_id = req.user.id;

        const order = await this.orderService.getOrderById(order_id);
        if (!order) {
            throw new HttpException('Order does not exist', 400);
        }
        if (order && (order.status === ORDER_STATUS.COMPLETED || order.status === ORDER_STATUS.IN_PROGRESS)) {
            throw new HttpException('Order already Delivered or on the way to delivery', 400);
        }

        const delivery = await this.deliveryService.createOrderDelivery(user_id, order_id, Number(ESTIMATED_DELIVERY_TIME));
        await this.orderService.updateOrderStatus(order.user_id, delivery.order_id, order.restaurant_id, ORDER_STATUS.IN_PROGRESS);

        const response = {
            ...delivery,
            createdAt: DateToMiliSeconds(delivery.createdAt),
            updatedAt: DateToMiliSeconds(delivery.updatedAt)
        };

        return new HttpResponse(response, false);
    }
}