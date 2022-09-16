import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProductoEntity])],
    
})
export class ProductoModule {}
