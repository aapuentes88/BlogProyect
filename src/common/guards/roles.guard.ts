import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UsersService } from "src/users/users.service";
import { ROLES_KEY } from "../constants/constants";
import { Role } from "../constants/enums/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate/*extends AuthGuard('jwt')*/{
  constructor(private reflector: Reflector, private readonly userService: UsersService) {
    // super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    //super.canActivate(context) as boolean
    //const { rawHeaders } = super.getRequest(context);
    // console.log(super.getRequest(context))
    const user = await this.userService.findUserByUserName(req.user.username)
    return requiredRoles.some((role) => user.roles.includes(role));
  }

}