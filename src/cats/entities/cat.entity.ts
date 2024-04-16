import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Cat {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 30
  })
  name: string

  @Column({
    type: 'int'
  })
  age: number

  @Column({
    type: 'varchar',
    length: 30
  })
  breed: string
}
