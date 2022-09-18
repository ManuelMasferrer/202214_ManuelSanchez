/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seedDatabase();
  });

    const seedDatabase = async () => {
      repository.clear();
      productosList = [];
      for(let i = 0; i<5; i++){
        const producto: ProductoEntity = await repository.save({
        nombre: faker.commerce.productName(),
        precio: +faker.commerce.price(),
        tipo: "No perecedero",
        })
        productosList.push(producto);
      }
    }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });



  it('findAll debe retornar el listado de productos', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productosList.length);
  });

  it('findOne debe retornar un producto identificado con un id', async () => {
    const storedProducto: ProductoEntity = productosList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre)
    expect(producto.precio).toEqual(storedProducto.precio)
    expect(producto.tipo).toEqual(storedProducto.tipo)
  });

  it('findOne debe arrojar un error para un producto con id invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El producto con el id proporcionado no ha sido encontrado.")
  });

  it('create debe guardar y retornar un nuevo producto', async () => {
    const producto: ProductoEntity = {
      id: "",
      nombre: faker.commerce.productName(),
      precio: +faker.commerce.price(),
      tipo: "Perecedero",
      tiendas: []
    }

    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({where: {id: newProducto.id}})
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(newProducto.nombre)
    expect(storedProducto.precio).toEqual(newProducto.precio)
    expect(storedProducto.tipo).toEqual(newProducto.tipo)
  });

  it('create debe arrojar un error si el tipo de producto no es valido', async () => {
    const producto: ProductoEntity = {
      id: "",
      nombre: faker.commerce.productName(),
      precio: +faker.commerce.price(),
      tipo: faker.random.word(),
      tiendas: []
    }

    await expect(() => service.create(producto)).rejects.toHaveProperty("message", "El tipo de producto debe ser \"No perecedero\" o \"Perecedero\".")
  });

  it('update debe modificar a un producto', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = "New name";
    producto.precio = 99.99;
    producto.tipo = "Perecedero"
  
    const updatedProducto: ProductoEntity = await service.update(producto.id, producto);
    expect(updatedProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({where: {id: producto.id}})
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(producto.nombre)
    expect(storedProducto.precio).toEqual(producto.precio)
    expect(storedProducto.tipo).toEqual(producto.tipo)
  
  });
 
  it('update debe arrojar una excepcion para un producto con id invalido', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto, nombre: "New name", precio: 999.99, tipo: "Perecedero"
    }
    await expect(() => service.update("0", producto)).rejects.toHaveProperty("message", "El producto con el id proporcionado no ha sido encontrado.")
  });

  it('update debe arrojar una excepcion para un producto con tipo invalido', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto, nombre: "New name", precio: 999.99, tipo: "Duradero"
    }
    await expect(() => service.update(producto.id, producto)).rejects.toHaveProperty("message", "El tipo de producto debe ser \"No perecedero\" o \"Perecedero\".")
  });

  it('delete debe eliminar una tienda', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
  
    const deletedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
    expect(deletedProducto).toBeNull();
  });

  it('delete arroja una excepcion para una tienda con id invalida', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El producto con el id proporcionado no ha sido encontrado.")
  });

});
