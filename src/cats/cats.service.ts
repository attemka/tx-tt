import { Injectable } from '@nestjs/common'
import { Cat } from './entities/cat.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateCatDto } from './dto/create-cat.dto'
import { UpdateCatDto } from './dto/update-cat.dto'

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catsRepository: Repository<Cat>
  ) {}

  private readonly cats: Cat[] = []

  create(createCatDto: CreateCatDto): Promise<Cat> {
    const cat = new Cat()
    cat.name = createCatDto.name
    cat.age = createCatDto.age
    cat.breed = createCatDto.breed

    return this.catsRepository.save(cat)
  }

  /**
   * this function is used to get all the cats
   * @returns promise of array of cats
   */
  findAllCats(): Promise<Cat[]> {
    return this.catsRepository.find()
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of cat.
   * @returns promise of cat
   */
  viewCat(id: number): Promise<Cat> {
    return this.catsRepository.findOneBy({ id })
  }

  /**
   * this function is used to updated specific cat whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of cat.
   * @param updateCatDto this is partial type of createCatDto.
   * @returns promise of update cat
   */
  updateCat(id: number, updateCatDto: UpdateCatDto): Promise<Cat> {
    const cat: Cat = new Cat()
    cat.name = updateCatDto.name
    cat.age = updateCatDto.age
    cat.breed = updateCatDto.breed
    cat.id = id
    return this.catsRepository.save(cat)
  }

  /**
   * this function is used to remove or delete cat from database.
   * @param id is the type of number, which represent id of cat
   * @returns number of rows deleted or affected
   */
  removeCat(id: number): Promise<{ affected?: number }> {
    return this.catsRepository.delete(id)
  }
}
