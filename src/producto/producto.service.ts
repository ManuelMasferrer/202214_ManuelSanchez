/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
@Injectable()
export class ProductoService {
    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>
    ){}

    async findAll(): Promise<ProductoEntity[]>{
        return await this.productoRepository.find({ relations: ['tiendas']});
    }

    async findOne(id: string): Promise<ProductoEntity>{
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: id}, relations: {tiendas: true,},});
        if(!producto) {
            throw new BusinessLogicException("El producto con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);
        }
        return producto;
    }

    async create(producto: ProductoEntity): Promise<ProductoEntity>{
        const tiposValidos = ["No perecedero", "Perecedero"]
        if (tiposValidos.indexOf(producto.tipo)  == -1){
            throw new BusinessLogicException("El tipo de producto debe ser \"No perecedero\" o \"Perecedero\".", BusinessError.BAD_REQUEST);
        } else {
        return await this.productoRepository.save(producto)
        }
    }

    async update(id: string, producto: ProductoEntity): Promise<ProductoEntity>{
        const persistedProducto: ProductoEntity = await this.productoRepository.findOne({where: {id}});
        const tiposValidos = ["No perecedero", "Perecedero"]
        if (tiposValidos.indexOf(producto.tipo)  == -1){
            throw new BusinessLogicException("El tipo de producto debe ser \"No perecedero\" o \"Perecedero\".", BusinessError.BAD_REQUEST);
        } else if (!persistedProducto) {
            throw new BusinessLogicException("El producto con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND)
        } else {
        return await this.productoRepository.save({...persistedProducto, ...producto });
        }
    }

    async delete(id: string) {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id} });
        if(!producto) {
            throw new BusinessLogicException("El producto con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);
        } else {
        return await this.productoRepository.remove(producto);
        }
    }
}
