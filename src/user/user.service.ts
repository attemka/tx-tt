import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { Role } from '../common/enums/roles.enum'
import { hashSync } from 'bcrypt'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  // This is used just for the sake of this tutorial to create some users.
  // Should be removed in production.
  async onModuleInit() {
    const user1: CreateUserDto = {
      username: 'user1',
      email: 'user1@example.com',
      name: 'User One',
      password: 'password1',
      roles: [Role.Admin]
    }

    const user2: CreateUserDto = {
      username: 'user2',
      email: 'user2@example.com',
      name: 'User Two',
      password: 'password2',
      roles: [Role.User]
    }

    await this.createUserIfNotExists(user1)
    await this.createUserIfNotExists(user2)
  }

  private async createUserIfNotExists(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { username: createUserDto.username } })
    const initUser = new User()
    initUser.roles = [Role.Admin]
    if (!existingUser) {
      await this.createUser(createUserDto, initUser)
    }
  }

  /**
   * this is function is used to create User in User Entity.
   * @param createUserDto this will type of createUserDto in which
   * we have defined what are the keys we are expecting from body
   * @param currentUser this will be type of User, which will be the
   * user who is creating the user.
   * @returns promise of user
   */
  createUser(createUserDto: CreateUserDto, currentUser?: User): Promise<User> {
    if (createUserDto.roles.includes(Role.Admin) && !currentUser.roles.includes(Role.Admin)) {
      throw new ForbiddenException('Only admins can change the role')
    }
    const user: User = new User()
    const saltRounds = 10
    const passHash = hashSync(createUserDto.password, saltRounds)
    const newUser = { ...user, ...createUserDto, password: passHash }
    return this.userRepository.save(newUser)
  }

  /**
   * this function is used to get all the user's list
   * @returns promise of array of users
   */
  findAllUsers(): Promise<User[]> {
    return this.userRepository.find()
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of user.
   * @returns promise of user
   */
  viewUser(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id })
  }

  /**
   * this function is used to get user by username
   * @param username is type of string, which represent the username of user.
   * @returns promise of user
   */
  findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } })
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param updaterId is type of number, which represent the id of user who is updating the user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of updated user
   */
  async updateUser(id: number, updaterId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const updater = await this.userRepository.findOneBy({ id: updaterId })

    if (!updater.roles.includes(Role.Admin) && id !== updaterId) {
      throw new ForbiddenException('You are not allowed to update this user')
    }

    await this.userRepository.update(id, updateUserDto)
    return this.userRepository.findOneBy({ id })
  }

  /**
   * this function is used to remove or delete user from database.
   * @param id is the type of number, which represent id of user
   * @returns number of rows deleted or affected
   */
  removeUser(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id)
  }
}
