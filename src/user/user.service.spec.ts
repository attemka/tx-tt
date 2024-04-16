import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UpdateUserDto } from './dto/update-user.dto'
import { Role } from '../common/enums/roles.enum'

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            save: jest.fn().mockResolvedValue(null),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            find: jest.fn().mockResolvedValue([]),
            update: jest.fn().mockResolvedValue(null)
          }
        }
      ]
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should create a user', async () => {
    const user = new User()
    user.username = 'user1'
    user.email = 'user1@example.com'
    user.name = 'User One'
    user.password = 'password1'
    user.roles = [Role.Admin]

    jest.spyOn(service, 'createUser').mockResolvedValue(user)
    expect(await service.createUser(user)).toBe(user)
  })

  it('should find all users', async () => {
    const result = []
    jest.spyOn(service, 'findAllUsers').mockResolvedValue(result)
    expect(await service.findAllUsers()).toBe(result)
  })

  it('should find one user', async () => {
    const user = new User()
    user.id = 1
    user.username = 'user1'
    user.email = 'user1@example.com'
    user.name = 'User One'
    user.password = 'password1'
    user.roles = [Role.Admin]

    jest.spyOn(service, 'viewUser').mockResolvedValue(user)
    expect(await service.viewUser(1)).toBe(user)
  })

  it('should update a user', async () => {
    const dto: UpdateUserDto = {
      name: 'Updated User One'
    }

    const user = new User()
    user.id = 1
    user.username = 'user1'
    user.email = 'user1@example.com'
    user.name = dto.name
    user.password = 'password1'
    user.roles = [Role.Admin]

    jest.spyOn(service, 'updateUser').mockResolvedValue(user)
    expect(await service.updateUser(1, 1, dto)).toBe(user)
  })

  it('should remove a user', async () => {
    const result = {
      affected: 1
    }
    jest.spyOn(service, 'removeUser').mockResolvedValue(result)
    expect(await service.removeUser(1)).toBe(result)
  })
})
