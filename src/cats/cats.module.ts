import { Module } from '@nestjs/common'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cat } from './entities/cat.entity'
import { RolesGuard } from '../common/guards/roles.guard'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), TypeOrmModule.forFeature([Cat])],
  controllers: [CatsController],
  providers: [CatsService, RolesGuard]
})
export class CatsModule {}
