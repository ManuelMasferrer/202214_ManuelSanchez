import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductoEntity } from 

@Entity()
export class TiendaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    ciudad: string;

    @Column()
    direccion: string;

    @ManyToMany( () => ProductoEntity, (producto) => producto.tiendas)
    @JoinTable()
    productos: ProductoEntity[];
}
