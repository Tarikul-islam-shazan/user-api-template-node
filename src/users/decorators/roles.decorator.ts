import { SetMetadata } from '@nestjs/common';
import { RoleBase } from '../enums/user-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleBase[]) => SetMetadata(ROLES_KEY, roles);
