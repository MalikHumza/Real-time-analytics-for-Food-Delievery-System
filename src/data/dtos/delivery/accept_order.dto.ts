import { IsNotEmpty, IsNumber } from "class-validator";

export class AcceptOrderDeliveryDTO {
    @IsNumber()
    @IsNotEmpty()
    readonly delivery_time: number;
}