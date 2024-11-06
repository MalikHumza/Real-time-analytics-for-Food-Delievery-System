import { RequestWithUser } from '@data/interfaces/request.interface';
import { HttpResponse } from '@data/res/http_response';
import { OrdersService } from '@data/services/orders/orders.service';
import { DateToMiliSeconds } from '@infrastructure/common/epoch_converter';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetOrdersByUserUseCase {
  @Inject()
  private orderService: OrdersService;

  public async call(req: RequestWithUser) {
    const user_id = req.user.id;

    let response;
    const orders = await this.orderService.getOrderByUser(user_id);
    if (orders!.length > 0) {
      response = [];
    }
    response = orders.map((i) => ({
      ...i,
      createdAt: DateToMiliSeconds(i.createdAt),
      updatedAt: DateToMiliSeconds(i.updatedAt),
    }));

    return new HttpResponse(response, false);
  }
}
