import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class TiendaService {
    constructor(
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
    ){}

    async findAll(): Promise<TiendaEntity[]>{
        return await this.tiendaRepository.find({ relations: ['productos']});
    }

    async findOne(id: string): Promise<TiendaEntity>{
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id}, relations: {productos: true,},});
        if(!tienda) {
            throw new BusinessLogicException("La tienda con el id proporcionado no ha sido encontrada.", BusinessError.NOT_FOUND);
        }
        return tienda;
    }

    async create(tienda: TiendaEntity): Promise<TiendaEntity>{
        if (tienda.ciudad.length !== 3){
            throw new BusinessLogicException("El codigo de ciudad debe tener tres caracteres", BusinessError.BAD_REQUEST);
        } else {
        return await this.tiendaRepository.save(tienda)
        }
    }

    async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity>{
        const persistedTienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id}});
        if (tienda.ciudad.length !== 3){
            throw new BusinessLogicException("El codigo de ciudad debe tener tres caracteres", BusinessError.BAD_REQUEST);
        } else if (!persistedTienda) {
            throw new BusinessLogicException("La tienda con el id proporcionado no ha sido encontrada.", BusinessError.NOT_FOUND)
        }
        else {
        return await this.tiendaRepository.save({...persistedTienda, ...tienda });
        }
    }

    async delete(id: string) {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id}});
        if(!tienda) {
            throw new BusinessLogicException("La tienda con el id proporcionado no ha sido encontrada.", BusinessError.NOT_FOUND);
        } else {
        return await this.tiendaRepository.remove(tienda);
        }
    }
}
