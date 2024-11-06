import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRestaurantDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly location: string;
}
