import { IsNotEmpty, IsString, Length  } from "class-validator";

export class TiendaDto {
    readonly id: string;

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    @Length(3)
    readonly ciudad: string;

    @IsString()
    @IsNotEmpty()
    readonly direccion: string;

}