import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ProductoEntity])],
    controllers: [ProductoController],
    providers: [ProductoService],
    
})
export class ProductoModule {}
