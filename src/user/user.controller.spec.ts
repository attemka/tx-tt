import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { Role } from '../common/enums/roles.enum'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ForbiddenException } from '@nestjs/common'

describe('UserController', () => {
  let controller: UserController
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {}
        }
      ]
    }).compile()

    controller = module.get<UserController>(UserController)
    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      username: 'user1',
      email: 'user1@example.com',
      name: 'User One',
      password: 'password1',
      roles: [Role.Admin]
    }

    const user = new User()
    user.username = dto.username
    user.email = dto.email
    user.name = dto.name
    user.password = dto.password
    user.roles = dto.roles

    jest.spyOn(service, 'createUser').mockImplementation(async () => user)
    expect(await controller.create(dto)).toBe(user)
  })

  it('should find all users', async () => {
    const result = []
    jest.spyOn(service, 'findAllUsers').mockImplementation(async () => result)
    expect(await controller.findAll()).toBe(result)
  })

  it('should find one user', async () => {
    const result = {
      username: 'user1',
      email: 'user1@example.com',
      name: 'User One',
      password: 'password1',
      roles: [Role.Admin]
    } as User
    jest.spyOn(service, 'viewUser').mockImplementation(async () => result)
    expect(await controller.findOne('1')).toBe(result)
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
    user.currentUser = 1

    jest.spyOn(service, 'updateUser').mockImplementation(async () => user)
    expect(await controller.update('1', '1', dto)).toBe(user)
  })

  it('user should not be able to update another user', async () => {
    const dto: UpdateUserDto = {
      name: 'Updated User One'
    }

    const user = new User()
    user.id = 1
    user.username = 'user1'
    user.email = 'user1@example.com'
    user.name = 'User One'
    user.password = 'password1'
    user.roles = [Role.User] // Non-admin role

    const updater = new User()
    updater.id = 2
    updater.username = 'user2'
    updater.email = 'user2@example.com'
    updater.name = 'User Two'
    updater.password = 'password2'
    updater.roles = [Role.User] // Non-admin role

    jest.spyOn(service, 'updateUser').mockImplementation(async () => {
      throw new ForbiddenException('You are not allowed to update this user')
    })

    await expect(controller.update('1', '2', dto)).rejects.toThrow(ForbiddenException)
  })

  it('should remove a user', async () => {
    const result = {
      affected: 1
    }
    jest.spyOn(service, 'removeUser').mockImplementation(async () => result)
    expect(await controller.remove('1')).toBe(result)
  })
})
