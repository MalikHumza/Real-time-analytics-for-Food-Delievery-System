import database from '@config/database';
import { CreateRestaurantDTO } from '@data/dtos/restaurant/create_restaurant.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RestaurantService {
  private restuarant = database.instance.restaurants;

  createRestaurant(user_id: string, data: CreateRestaurantDTO) {
    return this.restuarant.create({
      data: {
        name: data.name,
        location: data.location,
        user_id,
      },
    });
  }

  getRestaurantById(id: string) {
    return this.restuarant.findUnique({
      where: {
        id,
      },
      include: {
        Dishes: true,
        Orders: true,
      },
    });
  }

  findRestaurantsByRating(rating: number) {
    return this.restuarant.findMany({
      where: {
        rating,
      },
    });
  }

  getAllRestaurantByUser(user_id: string) {
    return this.restuarant.findMany({
      where: {
        user_id
      }
    })
  }

  getAllRestaurants() {
    return this.restuarant.findMany();
  }
}
