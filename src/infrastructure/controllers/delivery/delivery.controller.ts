import { ROLES } from '@data/enums/roles.enum';
import { Roles } from '@infrastructure/decorators/roles.decorator';
import { RequestWithUser } from '@data/interfaces/request.interface';
import { DeliverOrderUseCase } from '@domain/usecases/delivery/deliver_order';
import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AcceptOrderDeliveryUseCase } from '@domain/usecases/delivery/accept_order_delivery';
import { GetAverageDeliveryTimeForCompletedOrderUseCase } from '@domain/usecases/delivery/get_average_delivery_time';
@Controller('delivery')
export class DeliveryController {
  constructor(
    private readonly acceptOrderDeliveryUseCase: AcceptOrderDeliveryUseCase,
    private readonly deliverOrderUseCase: DeliverOrderUseCase,
    private readonly getAverageDeliveryTimeForCompletedOrderUseCase: GetAverageDeliveryTimeForCompletedOrderUseCase,
  ) {}

  @Roles(ROLES.RIDER)
  @Post('/accept/:order_id')
  @HttpCode(201)
  acceptOrders(
    @Req() req: RequestWithUser,
    @Param('order_id') order_id: string,
  ) {
    return this.acceptOrderDeliveryUseCase.call(req, order_id);
  }

  @Roles(ROLES.RIDER)
  @Post('/deliver/:order_id')
  @HttpCode(201)
  deliverOrders(
    @Req() req: RequestWithUser,
    @Param('order_id') order_id: string,
  ) {
    return this.deliverOrderUseCase.call(req, order_id);
  }

  @Roles(ROLES.RIDER, ROLES.ADMIN)
  @Get('/analytics/delivery-times/:restaurant_id')
  @HttpCode(200)
  getAverageDeliveryTimeForCompletedOrders(
    @Param('restaurant_id') restaurant_id: string,
    @Query('period') period: string,
  ) {
    return this.getAverageDeliveryTimeForCompletedOrderUseCase.call(
      restaurant_id,
      period,
    );
  }
}
