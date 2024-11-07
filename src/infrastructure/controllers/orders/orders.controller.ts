import { CreateOrdersDTO } from '@data/dtos/orders/create_order.dto';
import { ROLES } from '@data/enums/roles.enum';
import { RequestWithUser } from '@data/interfaces/request.interface';
import { GetOrderCompletedByUserUseCase } from '@domain/usecases/orders/completed_order_by_user';
import { CreateOrdersUseCase } from '@domain/usecases/orders/create_orders';
import { GetAllActiveOrdersUseCase } from '@domain/usecases/orders/get_all_active_orders';
import { GetAllPendingOrdersUseCase } from '@domain/usecases/orders/get_all_pending_orders';
import { GetOrdersByUserUseCase } from '@domain/usecases/orders/get_orders_by_user';
import { GetPeakOrderTimeForEachRestaurantUseCase } from '@domain/usecases/orders/get_peak_order_time_for_restaurants';
import { GetInProgressOrdersByUserUseCase } from '@domain/usecases/orders/inProgress_orders_by_user';
import { Roles } from '@infrastructure/decorators/roles.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrdersUseCase: CreateOrdersUseCase,
    private readonly getOrdersByUserUseCase: GetOrdersByUserUseCase,
    private readonly getOrderCompletedByUserUseCase: GetOrderCompletedByUserUseCase,
    private readonly getInProgressOrdersByUserUseCase: GetInProgressOrdersByUserUseCase,
    private readonly getAllPendingOrdersUseCase: GetAllPendingOrdersUseCase,
    private readonly getPeakOrderTimeForEachRestaurantUseCase: GetPeakOrderTimeForEachRestaurantUseCase,
    private readonly getAllActiveOrdersUseCase: GetAllActiveOrdersUseCase,
  ) {}

  @Roles(ROLES.CUSTOMER)
  @Post('/create/:restaurant_id')
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  createCustomerOrder(
    @Req() req: RequestWithUser,
    @Param('restaurant_id') restaurant_id: string,
    @Body() data: CreateOrdersDTO,
  ) {
    return this.createOrdersUseCase.call(req, restaurant_id, data);
  }

  @Get('/')
  @HttpCode(200)
  getOrdersByUser(@Req() req: RequestWithUser) {
    return this.getOrdersByUserUseCase.call(req);
  }

  @Roles(ROLES.RIDER)
  @Get('/my_orders/completed')
  @HttpCode(200)
  getCompletedOrdersByUser(@Req() req: RequestWithUser) {
    return this.getOrderCompletedByUserUseCase.call(req);
  }

  @Roles(ROLES.RIDER)
  @Get('/my_orders/in_progress')
  @HttpCode(200)
  getInProgressOrdersByUser(@Req() req: RequestWithUser) {
    return this.getInProgressOrdersByUserUseCase.call(req);
  }

  @Roles(ROLES.RIDER, ROLES.ADMIN)
  @Get('/pending_orders')
  @HttpCode(200)
  getAllPendingOrders() {
    return this.getAllPendingOrdersUseCase.call();
  }

  @Get('/analytics/peak-order-time')
  @HttpCode(200)
  getPeakOrderTimeForEachRestaurant() {
    return this.getPeakOrderTimeForEachRestaurantUseCase.call();
  }

  @Roles(ROLES.ADMIN)
  @Get('/orders/active/')
  @HttpCode(200)
  getAllActiveOrdersOlderThen30Minutes(@Req() req: RequestWithUser) {
    return this.getAllActiveOrdersUseCase.call(req);
  }
}
