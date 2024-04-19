import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CatsModule } from './cats/cats.module'
import { CoreModule } from './core/core.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { User } from './user/entities/user.entity'
import { Cat } from './cats/entities/cat.entity'

@Module({
  imports: [
    CoreModule,
    CatsModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, Cat],
        synchronize: true,
        logging: true,
      }),
    }),
    AuthModule,
    UserModule
  ]
})
export class AppModule {}
