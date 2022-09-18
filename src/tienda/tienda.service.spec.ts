/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { TiendaService } from './tienda.service';
import { TiendaEntity } from './tienda.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendasList = [];
    for(let i = 0; i<5; i++){
      const tienda: TiendaEntity = await repository.save({
        nombre: faker.company.name(),
        ciudad: faker.random.alpha({count: 3, casing: 'upper'}),
        direccion: faker.address.streetAddress(),
      })
      tiendasList.push(tienda)
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar el listado de tiendas', async () => {
    const tiendas: TiendaEntity[] = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas).toHaveLength(tiendasList.length);
  });

  it('findOne debe retornar una receta identificada con un id', async () => {
    const storedTienda: TiendaEntity = tiendasList[0];
    const tienda: TiendaEntity = await service.findOne(storedTienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedTienda.nombre)
    expect(tienda.ciudad).toEqual(storedTienda.ciudad)
    expect(tienda.direccion).toEqual(storedTienda.direccion)
  });

  it('findOne debe retornar una receta identificada con un id', async () => {
    const storedTienda: TiendaEntity = tiendasList[0];
    const tienda: TiendaEntity = await service.findOne(storedTienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedTienda.nombre)
    expect(tienda.ciudad).toEqual(storedTienda.ciudad)
    expect(tienda.direccion).toEqual(storedTienda.direccion)
  });

  it('findOne debe arrojar un error para una tienda con id invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La tienda con el id proporcionado no ha sido encontrada.")
  });

  it('create debe guardar y retornar una nueva tienda', async () => {
    const tienda: TiendaEntity = {
      id: "",
      nombre: faker.company.name(),
      ciudad: faker.random.alpha({count: 3, casing: 'upper'}),
      direccion: faker.address.streetAddress(),
      productos: []
    }

    const newTienda: TiendaEntity = await service.create(tienda);
    expect(newTienda).not.toBeNull();

    const storedTienda: TiendaEntity = await repository.findOne({where: {id: newTienda.id}})
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(newTienda.nombre)
    expect(storedTienda.ciudad).toEqual(newTienda.ciudad)
    expect(storedTienda.direccion).toEqual(newTienda.direccion)
  });

  it('create debe arrojar un error si la ciudad no es un codigo de tres caracteres', async () => {
    const tienda: TiendaEntity = {
      id: "",
      nombre: faker.company.name(),
      ciudad: faker.random.alpha({count: 4, casing: 'upper'}),
      direccion: faker.address.streetAddress(),
      productos: []
    }

    await expect(() => service.create(tienda)).rejects.toHaveProperty("message", "El codigo de ciudad debe tener tres caracteres")
  });

  it('update debe modificar a una tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    tienda.nombre = "New name";
    tienda.ciudad = "XYZ";
    tienda.direccion = "Nueva direccion"
  
    const updatedTienda: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedTienda).not.toBeNull();
  
    const storedTienda: TiendaEntity = await repository.findOne({where: {id: tienda.id}})
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(tienda.nombre)
    expect(storedTienda.ciudad).toEqual(tienda.ciudad)
    expect(storedTienda.direccion).toEqual(tienda.direccion)
  });
 
  it('update debe arrojar una excepcion para una tienda con id invalido', async () => {
    let tienda: TiendaEntity = tiendasList[0];
    tienda = {
      ...tienda, nombre: "New name", ciudad: "XYZ", direccion: "New address"
    }
    await expect(() => service.update("0", tienda)).rejects.toHaveProperty("message", "La tienda con el id proporcionado no ha sido encontrada.")
  });

  it('update debe arrojar una excepcion para una tienda con ciudad invalida', async () => {
    let tienda: TiendaEntity = tiendasList[0];
    tienda = {
      ...tienda, nombre: "New name", ciudad: "XYZW", direccion: "New address"
    }
    await expect(() => service.update("0", tienda)).rejects.toHaveProperty("message", "El codigo de ciudad debe tener tres caracteres")
  });

  it('delete debe eliminar una tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);
  
    const deletedTienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(deletedTienda).toBeNull();
  });

  it('delete arroja una excepcion para una tienda con id invalida', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La tienda con el id proporcionado no ha sido encontrada.")
  });

});
