import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString  } from "class-validator";

export class ProductoDto {
    readonly id: string;

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    readonly precio: number;

    @IsString()
    @IsNotEmpty()
    readonly tipo: string;
}