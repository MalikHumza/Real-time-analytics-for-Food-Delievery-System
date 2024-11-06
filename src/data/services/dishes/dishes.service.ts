import database from '@config/database';
import { CreateDishesDTO } from '@data/dtos/dishes/create_dishes.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DishesService {
  private dishes = database.instance.dishes;

  createDishes(restaurant_id: string, data: CreateDishesDTO) {
    return this.dishes.create({
      data: {
        name: data.name,
        category: data.category,
        price: data.price,
        popularity_score: data.popularity_score,
        isAvailable: data.isAvailable,
        restaurant_id,
      },
    });
  }

  getDishById(id: string) {
    return this.dishes.findUnique({
      where: {
        id,
      },
      include: {
        restaurant: true,
      },
    });
  }

  getDishesByName(name: string) {
    return this.dishes.findFirst({
      where: {
        name,
      },
      include: {
        restaurant: true,
      },
    });
  }

  getDishesByRestaurant(restaurant_id: string) {
    return this.dishes.findMany({
      where: {
        restaurant_id,
      },
    });
  }

  getDishesByPopularityScore(popularity_score: number) {
    return this.dishes.findMany({
      where: {
        popularity_score,
      },
      include: {
        restaurant: true,
      },
    });
  }

  getDishesByPrice(price: number) {
    return this.dishes.findMany({
      where: {
        price,
      },
      include: {
        restaurant: true,
      },
    });
  }

  async getTop5PopularDishes(restaurant_id: string) {
    return await this.dishes.groupBy({
      by: ['id', 'name', 'popularity_score', 'price'],
      orderBy: [
        { name: 'desc' },
        { popularity_score: 'desc' },
        { price: 'desc' },
      ],
      where: {
        restaurant_id,
      },
    });
  }
}
