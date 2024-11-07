import { RequestWithUser } from "@data/interfaces/request.interface";
import { HttpResponse } from "@data/res/http_response";
import { OrdersService } from "@data/services/orders/orders.service";
import { DateToMiliSeconds } from "@infrastructure/common/epoch_converter";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetOrderCompletedByUserUseCase {
    @Inject()
    private orderService: OrdersService;

    public async call(req: RequestWithUser) {
        const rider_id = req.user.id;

        let response;
        const completed_orders = await this.orderService.getCompletedOrdersByRider(rider_id);
        if (completed_orders.length === 0) {
            response = [];
        }
        response = completed_orders.map(i => ({
            ...i,
            createdAt: DateToMiliSeconds(i.createdAt),
            updatedAt: DateToMiliSeconds(i.updatedAt)
        }));

        return new HttpResponse(response, false);
    }
}