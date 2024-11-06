import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

class DishDTO {
    @IsString()
    @IsNotEmpty()
    readonly dish_id: string;

    @IsNumber()
    @IsNotEmpty()
    readonly quantity: number;
}

export class CreateOrdersDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DishDTO)
    readonly dishes: DishDTO[]
}