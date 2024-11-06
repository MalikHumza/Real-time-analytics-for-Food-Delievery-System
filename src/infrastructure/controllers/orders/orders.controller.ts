import { CreateOrdersDTO } from '@data/dtos/orders/create_order.dto';
import { ROLES } from '@data/enums/roles.enum';
import { RequestWithUser } from '@data/interfaces/request.interface';
import { CreateOrdersUseCase } from '@domain/usecases/orders/create_orders';
import { GetOrdersByUserUseCase } from '@domain/usecases/orders/get_orders_by_user';
import { Roles } from '@infrastructure/decorators/roles.decorator';
import { Body, Controller, Get, HttpCode, Param, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly createOrdersUseCase: CreateOrdersUseCase,
        private readonly getOrdersByUserUseCase: GetOrdersByUserUseCase,
    ) { }

    @Roles(ROLES.CUSTOMER)
    @Post('/create/:restaurant_id')
    @HttpCode(201)
    @UsePipes(new ValidationPipe())
    createCustomerOrder(@Req() req: RequestWithUser, @Param('restaurant_id') restaurant_id: string, @Body() data: CreateOrdersDTO) {
        return this.createOrdersUseCase.call(req, restaurant_id, data)
    }

    @Get('/')
    @HttpCode(200)
    getOrdersByUser(@Req() req: RequestWithUser) {
        return this.getOrdersByUserUseCase.call(req)
    }
}
