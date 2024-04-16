import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ParseIntPipe } from '../common/pipes/parse-int.pipe'
import { CatsService } from './cats.service'
import { CreateCatDto } from './dto/create-cat.dto'
import { Cat } from './interfaces/cat.interface'
import { Role } from '../common/enums/roles.enum'
import { AuthRoles } from '../common/decorators/authRoles.decorator'
import { AuthGuard } from '@nestjs/passport'

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @AuthRoles(Role.User)
  @UseGuards(AuthGuard())
  async create(
    @Body()
    createCatDto: CreateCatDto
  ) {
    return this.catsService.create(createCatDto)
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAllCats()
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseIntPipe())
    id: number
  ) {
    return this.catsService.viewCat(id)
  }

  @Put(':id')
  @AuthRoles(Role.Admin)
  @UseGuards(AuthGuard())
  async update(
    @Param('id', new ParseIntPipe())
    id: number,
    @Body()
    updateCatDto: CreateCatDto
  ) {
    return this.catsService.updateCat(id, updateCatDto)
  }

  @Delete(':id')
  @AuthRoles(Role.Admin)
  @UseGuards(AuthGuard())
  async remove(
    @Param('id', new ParseIntPipe())
    id: number
  ) {
    return this.catsService.removeCat(id)
  }
}
