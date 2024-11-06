import { DishesService } from "@data/services/dishes/dishes.service";
import { OrdersService } from "@data/services/orders/orders.service";
import { logger } from "@infrastructure/common/logger";
import { HttpException, Inject, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

export type OrderCreateData = {
    order_id: string,
    dishes: Array<{
        dish_id: string,
        quantity: number
    }>;
}

@Injectable()
export class OrderCreatedListener {
    @Inject()
    private dishesService: DishesService;
    @Inject()
    private orderService: OrdersService;

    @OnEvent('order.created')
    public async call(data: OrderCreateData) {

        let total_cost = 0;
        for (let index = 0; index < data.dishes.length; index++) {
            const item = data.dishes[index];
            const dishData = await this.dishesService.getDishById(item.dish_id);
            if (!dishData) {
                logger.error('Dish not found');
                throw new HttpException('Dish not found', 400);
            }
            total_cost += dishData.price * item.quantity;
        }

        await this.orderService.updateOrderTotalCost(data.order_id, total_cost);
    }
}