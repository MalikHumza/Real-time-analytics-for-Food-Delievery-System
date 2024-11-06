import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateDishesDTO {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly category: string;

    @IsNumber()
    @IsNotEmpty()
    readonly price: number;

    @IsNumber()
    @IsNotEmpty()
    readonly popularity_score: number;

    @IsBoolean()
    @IsNotEmpty()
    readonly isAvailable: boolean;
}