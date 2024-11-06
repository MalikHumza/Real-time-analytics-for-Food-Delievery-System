import { ROLES } from "@data/enums/roles.enum";
import { RequestWithUser } from "@data/interfaces/request.interface";
import { AcceptOrderDeliveryUseCase } from "@domain/usecases/delivery/accept_order_delivery";
import { DeliverOrderUseCase } from "@domain/usecases/delivery/deliver_order";
import { Roles } from "@infrastructure/decorators/roles.decorator";
import { Controller, HttpCode, Param, Post, Req } from "@nestjs/common";

@Controller('delivery')
export class DeliveryController {
    constructor(
        private readonly acceptOrderDeliveryUseCase: AcceptOrderDeliveryUseCase,
        private readonly deliverOrderUseCase: DeliverOrderUseCase,
    ) { }

    @Roles(ROLES.RIDER)
    @Post('/accept/:order_id')
    @HttpCode(201)
    acceptOrders(@Req() req: RequestWithUser, @Param('order_id') order_id: string) {
        return this.acceptOrderDeliveryUseCase.call(req, order_id);
    }

    @Roles(ROLES.RIDER)
    @Post('/deliver/:order_id')
    @HttpCode(201)
    deliverOrders(@Req() req: RequestWithUser, @Param('order_id') order_id: string) {
        return this.deliverOrderUseCase.call(req, order_id);
    }
}