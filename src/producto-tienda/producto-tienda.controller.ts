import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { TiendaEntity } from 'src/tienda/tienda.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptors';
import { ProductoTiendaService } from './producto-tienda.service';


@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
    constructor(private readonly productoTiendaService: ProductoTiendaService){}

    @Post(':productoId/tiendas/:tiendaId')
    async addStoreToProduct(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
        return await this.productoTiendaService.addStoreToProduct(productoId, tiendaId);
    }

    @Get(':productoId/tiendas')
    async findStoresFromProduct(@Param('productoId') productoId: string){
        return await this.productoTiendaService.findStoresFromProduct(productoId);
    }

    @Get(':productoId/tiendas/:tiendaId')
    async findStoreFromProduct(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
        return await this.productoTiendaService.findStoreFromProduct(productoId, tiendaId);
    }

    @Put(':productoId/tiendas')
    async updateStoresFromProduct(@Param('productoId') productoId: string, @Body() tiendas: TiendaEntity[]){
        // const tiendas: TiendaEntity[] = plainToInstance(TiendaEntity[], tiendasDto[]);
        return await this.productoTiendaService.updateStoresFromProduct(productoId, tiendas);
    }

    @Delete(':productoId/tiendas/:tiendaId')
    @HttpCode(204)
    async deleteStoreFromProduct(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
        return await this.productoTiendaService.deleteStoreFromProduct(productoId, tiendaId);
    }


}
