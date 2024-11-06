import { CreateDishesDTO } from '@data/dtos/dishes/create_dishes.dto';
import { ROLES } from '@data/enums/roles.enum';
import { CreateDishUseCase } from '@domain/usecases/dishes/create_dishes';
import { GetAllDishesByRestaurantUseCase } from '@domain/usecases/dishes/get_dishes_by_restaurant';
import { Roles } from '@infrastructure/decorators/roles.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('dishes')
export class DishesController {
  constructor(
    private readonly createDishUseCase: CreateDishUseCase,
    private readonly getAllDishesByRestaurantUseCase: GetAllDishesByRestaurantUseCase,
  ) {}

  @Roles(ROLES.ADMIN)
  @Post('create/:restaurant_id')
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  createDishes(
    @Param('restaurant_id') restaurant_id: string,
    @Body() data: CreateDishesDTO,
  ) {
    return this.createDishUseCase.call(restaurant_id, data);
  }

  @Get('restaurant/:restaurant_id')
  @HttpCode(200)
  getAllDishesByRestaurant(@Param('restaurant_id') restaurant_id: string) {
    return this.getAllDishesByRestaurantUseCase.call(restaurant_id);
  }
}
