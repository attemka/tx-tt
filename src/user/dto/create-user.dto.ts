import {
  IsAlphanumeric,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength
} from 'class-validator'
import { Role } from '../../common/enums/roles.enum'

const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must have at least 2 characters.' })
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have at least 3 characters.' })
  @IsAlphanumeric(null, {
    message: 'Username does not allow other than alpha numeric chars.'
  })
  username: string

  @IsNotEmpty()
  @IsEmail(null, { message: 'Please provide valid email.' })
  email: string

  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[]

  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain from 8 to 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`
  })
  password: string
}
