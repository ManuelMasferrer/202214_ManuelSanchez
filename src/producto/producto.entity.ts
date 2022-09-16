import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';

@Entity()
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    precio: number;

    @Column()
    tipo: string;

    @ManyToMany(() => TiendaEntity, (tienda) => tienda.productos)
    tiendas: TiendaEntity[];
}