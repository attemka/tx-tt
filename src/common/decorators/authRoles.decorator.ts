import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { RolesGuard } from '../guards/roles.guard'

export const ROLES_KEY = 'roles'
export const AuthRoles = (...roles: string[]) => {
  return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard))
}
