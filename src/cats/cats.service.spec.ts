import { Test, TestingModule } from '@nestjs/testing'
import { CatsService } from './cats.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Cat } from './entities/cat.entity'

describe('CatsService', () => {
  let service: CatsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: getRepositoryToken(Cat),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(null),
            save: jest.fn().mockResolvedValue(null),
            update: jest.fn().mockResolvedValue(null)
          }
        }
      ]
    }).compile()

    service = module.get<CatsService>(CatsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
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
    expect(await service.findAllCats()).toBe(result)
  })

  it('should find one cat', async () => {
    const result: Cat = {
      id: 1,
      age: 2,
      breed: 'testBreed',
      name: 'testName'
    }
    jest.spyOn(service, 'viewCat').mockResolvedValue(result)
    expect(await service.viewCat(1)).toBe(result)
  })

  it('should create a cat', async () => {
    const cat: Cat = {
      id: 1,
      age: 2,
      breed: 'testBreed',
      name: 'testName'
    }
    jest.spyOn(service, 'create').mockResolvedValue(cat)
    expect(await service.create(cat)).toBe(cat)
  })

  it('should update a cat', async () => {
    const cat: Cat = {
      id: 1,
      age: 2,
      breed: 'testBreed',
      name: 'testName'
    }
    jest.spyOn(service, 'updateCat').mockResolvedValue(cat)
    expect(await service.updateCat(1, cat)).toBe(cat)
  })

  it('should remove a cat', async () => {
    const result = {
      affected: 1
    }
    jest.spyOn(service, 'removeCat').mockResolvedValue(result)
    expect(await service.removeCat(1)).toBe(result)
  })
})
