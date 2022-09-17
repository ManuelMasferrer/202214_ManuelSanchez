import { Test, TestingModule } from '@nestjs/testing';
import { ProductoTiendaService } from './producto-tienda.service';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let tiendaRepository: Repository<TiendaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let tienda: TiendaEntity;
  let producto: ProductoEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));

    await seedDatabase();

  });

  const seedDatabase = async () => {
    tiendaRepository.clear();
    productoRepository.clear();

    tienda = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.random.alpha({count: 3, casing: 'upper'}),
      direccion: faker.address.streetAddress(),
      productos: []
    });

    producto = await productoRepository.save({
      nombre: faker.commerce.productName(),
      precio: +faker.commerce.price(),
      tipo: "No perecedero",
      tiendas: [tienda]
    })



  }
     

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct debe agregar una tienda a un producto', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      precio: +faker.commerce.price(),
      tipo: "Perecedero",
      tiendas: []
    })

    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.random.alpha({count: 3, casing: 'upper'}),
      direccion: faker.address.streetAddress(),
      productos: []
    })

    const resultado: ProductoEntity= await service.addStoreToProduct(newProducto.id, newTienda.id );
    expect(resultado.tiendas.length).toBe(1);
    expect(resultado.tiendas[0]).not.toBeNull();
    expect(resultado.tiendas[0].nombre).toBe(newTienda.nombre);
  });

  it('addStoreToProduct debe producir una excepcion para un producto con id invalido', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.random.alpha({count: 3, casing: 'upper'}),
      direccion: faker.address.streetAddress(),
    });

    await expect(() => service.addStoreToProduct("0", newTienda.id)).rejects.toHaveProperty("message", "El producto con el id proporcionado no ha sido encontrado.");
  });

  it('addStoreToProduct debe producir una excepcion para una tienda con id invalido', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      precio: +faker.commerce.price(),
      tipo: "Perecedero",
    })

    await expect (() => service.addStoreToProduct(newProducto.id, "0")).rejects.toHaveProperty("message", "La tienda con el id proporcionado no ha sido encontrada.");
  });

  it('findStoresFromProduct debe retornar las tiendas asociadas a un producto', async ()=>{
    const tiendas: TiendaEntity[] = await service.findStoresFromProduct(producto.id);
    expect(tiendas.length).toBe(1)
  });

  it('findStoresFromProduct debe arrojar una excepcion para un producto invalido', async () => {
    await expect(()=> service.findStoresFromProduct("0")).rejects.toHaveProperty("message", "El producto con el id proporcionado no ha sido encontrado."); 
  });

  it('findStoreFromProduct debe retornar una tienda asociada a un pais', async () => {
    const storedTienda: TiendaEntity = await service.findStoreFromProduct(producto.id, tienda.id )
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toBe(tienda.nombre);
  });

  it('findStoreFromProduct debe arrojar una excepcion para un producto con id invalido', async () => {
    const storedTienda: TiendaEntity = await service.findStoreFromProduct(producto.id, tienda.id );
    await expect(()=> service.findStoreFromProduct("0", storedTienda.id)).rejects.toHaveProperty("message", "El producto con el id proporcionado no ha sido encontrado."); 
  });

  it('findStoreFromProduct debe arrojar una excepcion para una tienda con id invalido', async () => {
    await expect(()=> service.findStoreFromProduct(producto.id, "0")).rejects.toHaveProperty("message", "La tienda con el id proporcionado no ha sido encontrada."); 
  });

  it('findStoreFromProduct debe arrojar una excepcion para una tienda no asociada a un producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.random.alpha({count: 3, casing: 'upper'}),
      direccion: faker.address.streetAddress(),
    });

    await expect(()=> service.findStoreFromProduct(producto.id, newTienda.id)).rejects.toHaveProperty("message", "La tienda con el id proporcionado no esta asociada al producto");
  });

  it('updateStoresFromProduct debe actualizar las tiendas asociadas a un producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.random.alpha({count: 3, casing: 'upper'}),
      direccion: faker.address.streetAddress(),
    });
    const updatedProducto: ProductoEntity = await service.updateStoresFromProduct(producto.id, [newTienda]);
    expect(updatedProducto.tiendas.length).toBe(1);
    expect(updatedProducto.tiendas[0].nombre).toBe(newTienda.nombre)
    expect(updatedProducto.tiendas[0].ciudad).toBe(newTienda.ciudad)  
    expect(updatedProducto.tiendas[0].direccion).toBe(newTienda.direccion)    
  });

  it('updateStoresFromProduct debe arrojar una excepcion para un producto con id invalido', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.random.alpha({count: 3, casing: 'upper'}),
      direccion: faker.address.streetAddress(),
    });
    await expect(() => service.updateStoresFromProduct("0", [newTienda])).rejects.toHaveProperty("message", "El producto con el id proporcionado no ha sido encontrado.");
  });

  it('updateStoresFromProduct debe arrojar una excepcion para una tienda con id invalido', async ()=> {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.random.alpha({count: 3, casing: 'upper'}),
      direccion: faker.address.streetAddress(),
    });
    newTienda.id = "0";

    await expect(()=> service.updateStoresFromProduct(producto.id, [newTienda])).rejects.toHaveProperty("message", "La tienda con el id proporcionado no ha sido encontrada.")
  });

  it('deleteStoreFromProduct debe desasociar una tienda de un producto', async ()=> {
    await service.deleteStoreFromProduct(producto.id, tienda.id);
    const storedProducto: ProductoEntity = await productoRepository.findOne({where: {id: producto.id}, relations: ["tiendas"]});
    const deletedTienda: TiendaEntity = storedProducto.tiendas.find(p => p.id === tienda.id);

    expect(deletedTienda).toBeUndefined();
  })

  it('deleteStoreFromProduct debe arrojar una excepcion para un producto con id invalida', async () => {
    await expect(()=> service.deleteStoreFromProduct("0", tienda.id)).rejects.toHaveProperty("message", "El producto con el id proporcionado no ha sido encontrado."); 
  });

  it('deleteStoreFromProduct debe arrojar una excepcion para una tienda con id invalida', async () => {
    await expect(()=> service.deleteStoreFromProduct(producto.id, "0")).rejects.toHaveProperty("message", "La tienda con el id proporcionado no ha sido encontrada."); 
  });

  it('deleteStoreFromProduct debe arrojar una excepcion para una tienda no asociada a un producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.random.alpha({count: 3, casing: 'upper'}),
      direccion: faker.address.streetAddress(),
    });
    await expect(()=> service.deleteStoreFromProduct(producto.id, newTienda.id)).rejects.toHaveProperty("message", "La tienda con el id proporcionado no esta asociada al producto"); 
  });

});
