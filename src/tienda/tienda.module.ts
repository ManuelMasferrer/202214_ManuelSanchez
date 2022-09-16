import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from './tienda.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TiendaEntity])]
})
export class TiendaModule {}
