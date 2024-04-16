import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CatsModule } from './cats/cats.module'
import { CoreModule } from './core/core.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import { User } from './user/entities/user.entity'
import { Cat } from './cats/entities/cat.entity'

@Module({
  imports: [
    CoreModule,
    CatsModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'postgres',
      username: 'postgres',
      entities: [User, Cat],
      database: 'catsDB',
      synchronize: true,
      logging: true
    }),
    AuthModule,
    UserModule
  ]
})
export class AppModule {}
