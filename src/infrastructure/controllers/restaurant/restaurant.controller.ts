import { CreateRestaurantDTO } from '@data/dtos/restaurant/create_restaurant.dto';
import { ROLES } from '@data/enums/roles.enum';
import { RequestWithUser } from '@data/interfaces/request.interface';
import { CreateRestaurantUseCase } from '@domain/usecases/restaurant/create_restaurant';
import { GetRestaurantByIdUseCase } from '@domain/usecases/restaurant/get_restaurant_by_id';
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

@Controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly createRestaurantUseCase: CreateRestaurantUseCase,
    private readonly getRestaurantByIdUseCase: GetRestaurantByIdUseCase,
  ) {}

  @Roles(ROLES.ADMIN)
  @Post('/create')
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  createRestaurant(
    @Req() req: RequestWithUser,
    @Body() data: CreateRestaurantDTO,
  ) {
    return this.createRestaurantUseCase.call(req, data);
  }

  @Get('/:id')
  @HttpCode(200)
  getRestaurantById(@Param('id') id: string) {
    return this.getRestaurantByIdUseCase.call(id);
  }
}
