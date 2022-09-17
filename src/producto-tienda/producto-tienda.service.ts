import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProductoTiendaService {
    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>,

        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
    ){}

    async addStoreToProduct( productoId: string, tiendaId: string,): Promise<ProductoEntity>{
        const producto = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]});
        if(!producto) {
            throw new BusinessLogicException("El producto con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);
        }
        const tienda = await this.tiendaRepository.findOne({where: {id: tiendaId}});
        if(!tienda){
            throw new BusinessLogicException("La tienda con el id proporcionado no ha sido encontrada.", BusinessError.NOT_FOUND);
        }
        producto.tiendas = [...producto.tiendas, tienda];
        return await this.productoRepository.save(producto);
    }

    async findStoresFromProduct( productoId: string): Promise<TiendaEntity[]>{
        const producto = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]});
        if(!producto) {
            throw new BusinessLogicException("El producto con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);
        } else{
            return producto.tiendas;
        }
    }

    async findStoreFromProduct( productoId: string, tiendaId: string): Promise<TiendaEntity>{
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId} });
        if(!tienda){
            throw new BusinessLogicException("La tienda con el id proporcionado no ha sido encontrada.", BusinessError.NOT_FOUND);
        }
        const producto = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]});
        if(!producto) {
            throw new BusinessLogicException("El producto con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);
        }
        const tiendaProducto = producto.tiendas.find(e => e.id == tienda.id)
        if(!tiendaProducto) {
            throw new BusinessLogicException("La tienda con el id proporcionado no ofrece el producto", BusinessError.PRECONDITION_FAILED);
        }
        return tiendaProducto;
    }

    async updateStoresFromProduct(productoId: string, tiendas: TiendaEntity[]): Promise<ProductoEntity>{
        const producto = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]});
        if(!producto) {
            throw new BusinessLogicException("El producto con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);
        }
        for(const t of tiendas){
            const tienda = await this.tiendaRepository.findOne({where: {id: t.id},});
            if (!tienda){
                throw new BusinessLogicException("La tienda con el id proporcionado no ha sido encontrada.", BusinessError.NOT_FOUND);
            }
        }
        producto.tiendas = tiendas;
        return await this.productoRepository.save(producto)

    }

    async deleteStoreFromProduct(productoId: string, tiendaId: string) {
        const producto = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]});
        if(!producto) {
            throw new BusinessLogicException("El producto con el id proporcionado no ha sido encontrado.", BusinessError.NOT_FOUND);
        }
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}});
        if(!tienda){
            throw new BusinessLogicException("La tienda con el id proporcionado no ha sido encontrada.", BusinessError.NOT_FOUND);
        }
        const tiendaProducto: TiendaEntity = producto.tiendas.find(e => e.id === tienda.id)
        if(!tiendaProducto) {
            throw new BusinessLogicException("La tienda con el id proporcionado no ofrece el producto", BusinessError.PRECONDITION_FAILED);
        }
        producto.tiendas = producto.tiendas.filter(e => e.id !== tiendaId);
        await this.productoRepository.save(producto);
    }

}
