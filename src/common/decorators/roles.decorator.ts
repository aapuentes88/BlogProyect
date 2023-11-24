
import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/enums/roles.enum';
import { ROLES_KEY } from '../constants/constants';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
