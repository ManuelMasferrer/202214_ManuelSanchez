import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductoModule } from './producto/producto.module';
import { TiendaModule } from './tienda/tienda.module';

@Module({
  imports: [ProductoModule, TiendaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
