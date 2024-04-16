import { Controller, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<{ accessToken: string }> {
    const user = req.user
    return await this.authService.login(user)
  }

  @Post('register')
  async register(@Request() req): Promise<any> {
    const { username, password, name, email, role } = req.body
    const user = await this.authService.register(username, password, name, email, role)
    return { user }
  }
}
