import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto)
  }

  @Get()
  findAll() {
    return this.userService.findAllUsers()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.viewUser(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updaterId: string, updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(+id, +updaterId, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(+id)
  }
}
