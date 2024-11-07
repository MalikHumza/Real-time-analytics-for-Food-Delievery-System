import { HttpResponse } from "@data/res/http_response";
import { OrdersService } from "@data/services/orders/orders.service";
import { DateToMiliSeconds } from "@infrastructure/common/epoch_converter";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetAllPendingOrdersUseCase {
    @Inject()
    private orderService: OrdersService;

    public async call() {
        let response;
        const pendingOrders = await this.orderService.getAllPendingOrders();
        if (pendingOrders.length === 0) {
            response = [];
        }
        response = pendingOrders.map(i => ({
            ...i,
            createdAt: DateToMiliSeconds(i.createdAt),
            updatedAt: DateToMiliSeconds(i.updatedAt)
        }));

        return new HttpResponse(response, false);
    }
}