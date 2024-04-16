import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { User } from '../user/entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import { Role } from '../common/enums/roles.enum'
import { hashSync } from 'bcrypt'

describe('AuthService', () => {
  let service: AuthService
  let userService: UserService
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUser: jest.fn().mockResolvedValue(null),
            findAllUsers: jest.fn().mockResolvedValue([]),
            findByUsername: jest.fn().mockResolvedValue(null),
            createUser: jest.fn().mockResolvedValue(null)
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockResolvedValue('testToken')
          }
        }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  jest.mock('bcrypt', () => ({
    compareSync: jest.fn(() => true)
  }))

  it('should validate a user', async () => {
    const user: User = {
      id: 1,
      username: 'test',
      email: 'test',
      name: 'test',
      password: hashSync('password', 10),
      currentUser: 1,
      roles: [Role.Admin]
    }
    jest.spyOn(userService, 'findByUsername').mockResolvedValue(user)
    // user without password
    const { password: _, ...returnedUser } = user
    expect(await service.validateUser('test', 'password')).toEqual(returnedUser)
  })

  it('should return null if user is not found', async () => {
    jest.spyOn(userService, 'findByUsername').mockResolvedValue(null)
    expect(await service.validateUser('test', 'test')).toBe(null)
  })

  it('should login a user', async () => {
    const user: User = {
      id: 1,
      username: 'test',
      email: 'test@example.com',
      name: 'Test User',
      password: 'test',
      currentUser: 1,
      roles: [Role.Admin]
    }
    jest.spyOn(jwtService, 'sign').mockReturnValue('testToken')
    expect(await service.login(user)).toEqual({ accessToken: 'testToken' })
  })

  it('should register a user', async () => {
    const username = 'test'
    const password = 'test'
    const name = 'Test User'
    const email = 'test@example.com'
    const roles = [Role.Admin]

    const user: User = {
      id: 1,
      username: username,
      password: password,
      email: email,
      name: name,
      currentUser: 1,
      roles: roles
    }

    jest.spyOn(userService, 'findByUsername').mockResolvedValue(null)
    jest.spyOn(userService, 'createUser').mockResolvedValue(user)
    const { password: _, ...result } = user
    expect(await service.register(username, password, name, email, roles)).toEqual(result)
  })
})
