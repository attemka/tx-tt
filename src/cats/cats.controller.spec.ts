import { Test, TestingModule } from '@nestjs/testing'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'
import { Cat } from './entities/cat.entity'
import { ForbiddenException } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

describe('CatsController', () => {
  let controller: CatsController
  let service: CatsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [CatsController],
      providers: [
        CatsService,
        {
          provide: CatsService,
          useValue: {
            findAllCats: jest.fn().mockResolvedValue([]),
            viewCat: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(null),
            updateCat: jest.fn().mockResolvedValue(null),
            removeCat: jest.fn().mockResolvedValue(null)
          }
        }
      ]
    }).compile()

    controller = module.get<CatsController>(CatsController)
    service = module.get<CatsService>(CatsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should find all cats', async () => {
    const result: Cat[] = [
      {
        id: 1,
        age: 2,
        breed: 'testBreed',
        name: 'testName'
      }
    ]
    jest.spyOn(service, 'findAllCats').mockResolvedValue(result)
    expect(await controller.findAll()).toBe(result)
  })

  it('should find one cat', async () => {
    const result: Cat = {
      id: 1,
      age: 2,
      breed: 'testBreed',
      name: 'testName'
    }
    jest.spyOn(service, 'viewCat').mockResolvedValue(result)
    expect(await controller.findOne(1)).toBe(result)
  })

  it('should create a cat', async () => {
    const cat: Cat = {
      id: 1,
      age: 2,
      breed: 'testBreed',
      name: 'testName'
    }
    jest.spyOn(service, 'create').mockResolvedValue(cat)
    expect(await controller.create(cat)).toBe(cat)
  })

  it('should update a cat', async () => {
    const cat: Cat = {
      id: 1,
      age: 2,
      breed: 'testBreed',
      name: 'testName'
    }
    jest.spyOn(service, 'updateCat').mockResolvedValue(cat)
    expect(await controller.update(1, cat)).toBe(cat)
  })

  it('should remove a cat', async () => {
    const result = {
      affected: 1
    }
    jest.spyOn(service, 'removeCat').mockResolvedValue(result)
    expect(await controller.remove(1)).toBe(result)
  })

  it('should not allow a non-admin user to update a cat', async () => {
    jest.spyOn(service, 'updateCat').mockImplementation(() => {
      throw new ForbiddenException()
    })
    await expect(controller.update(1, {} as Cat)).rejects.toThrow(ForbiddenException)
  })

  it('should not allow a non-admin user to remove a cat', async () => {
    jest.spyOn(service, 'removeCat').mockImplementation(() => {
      throw new ForbiddenException()
    })
    await expect(controller.remove(1)).rejects.toThrow(ForbiddenException)
  })
})
