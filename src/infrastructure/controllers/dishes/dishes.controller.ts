import { CreateDishesDTO } from '@data/dtos/dishes/create_dishes.dto';
import { ROLES } from '@data/enums/roles.enum';
import { CreateDishUseCase } from '@domain/usecases/dishes/create_dishes';
import { Roles } from '@infrastructure/decorators/roles.decorator';
import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('dishes')
export class DishesController {
  constructor(private readonly createDishUseCase: CreateDishUseCase) {}

  // Create a new dish
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

  // Get all dishes for a specific restaurant
  // @Get('restaurant/:restaurantId')
  // getAllByRestaurant(@Param('restaurantId') restaurantId: string) {
  //     return this.dishesService.getAllDishesByRestaurant(restaurantId);
  // }

  // // Update a dish
  // @Patch(':id')
  // update(
  //     @Param('id') id: string,
  //     @Body() updateDishDto: UpdateDishDto,
  // ) {
  //     return this.dishesService.updateDish(id, updateDishDto);
  // }

  // // Delete a dish
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //     return this.dishesService.deleteDish(id);
  // }
}
