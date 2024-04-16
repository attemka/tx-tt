import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Role } from '../../common/enums/roles.enum'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 15 })
  username: string

  @Column({ type: 'varchar', length: 40 })
  email: string

  @Column({ type: 'varchar', length: 30 })
  name: string

  @Column({ type: 'varchar' })
  password: string

  @Column({ type: 'enum', enum: Role })
  roles: Role[]

  currentUser: number
}
