import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { Role } from '../common/enums/roles.enum'
import { compareSync } from 'bcrypt'
import { User } from '../user/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  /**
   * Validates a user's credentials.
   *
   * @param {string} username - The username of the user.
   * @param {string} pass - The password of the user.
   * @returns {Promise<any>} A promise that resolves to the user object if the credentials are valid, or null otherwise.
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username)
    if (!user) {
      return null
    }
    const passValid = compareSync(pass, user.password)
    if (passValid) {
      const { password: _, ...result } = user
      return result
    }
    return null
  }

  /**
   * Logs a user in and returns a JWT token.
   *
   * @param {User} user - The user to log in.
   * @returns {Promise<{accessToken: string}>} A promise that resolves to an object containing the JWT token.
   */
  async login(user: User): Promise<{ accessToken: string }> {
    const payload = { sub: user.id }
    return {
      accessToken: this.jwtService.sign(payload)
    }
  }

  /**
   * Registers a new user.
   *
   * @param {string} username - The username of the new user.
   * @param {string} password - The password of the new user.
   * @param {string} name - The name of the new user.
   * @param {string} email - The email of the new user.
   * @param {Role[]} roles - The roles of the new user.
   * @returns {Promise<any>} A promise that resolves to the newly created user object.
   */
  async register(username: string, password: string, name: string, email: string, roles: Role[]): Promise<any> {
    const user = await this.userService.createUser({
      username,
      password,
      name,
      email,
      roles
    })

    const { password: _, ...result } = user

    return result
  }
}
